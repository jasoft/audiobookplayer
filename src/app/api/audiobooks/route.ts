import fs from "fs/promises";
import path from "path";
import type { Audiobook, Chapter } from "~/app/types";
import { NextResponse } from "next/server";

// 设置有声书目录的路径
const AUDIOBOOKS_DIR = path.join(process.cwd(), "public", "audiobooks");
console.log(AUDIOBOOKS_DIR);

async function getAudiobooks(): Promise<Audiobook[]> {
  const cacheFilePath = path.join(AUDIOBOOKS_DIR, "audiobooks_cache.json");

  try {
    const cachedData = await fs.readFile(cacheFilePath, "utf-8");
    console.log("使用缓存的有声书数据");
    return JSON.parse(cachedData) as Audiobook[];
  } catch (error) {
    console.log("缓存文件不存在或读取缓存文件时出错，重新扫描目录", error);
  }

  try {
    console.log("开始扫描有声书目录");
    const bookDirs = await fs.readdir(AUDIOBOOKS_DIR);
    console.log(`找到 ${bookDirs.length} 个目录`);
    const books: Audiobook[] = [];

    for (let index = 0; index < bookDirs.length; index++) {
      const bookDir = bookDirs[index];
      if (!bookDir) {
        continue;
      }
      console.log(`正在处理目录: ${bookDir}`);
      const bookPath = path.join(AUDIOBOOKS_DIR, bookDir);
      const stats = await fs.stat(bookPath);

      if (stats.isDirectory()) {
        console.log(`${bookDir} 是一个有效的目录`);
        const chapterFiles = await fs.readdir(bookPath);
        console.log(`在 ${bookDir} 中找到 ${chapterFiles.length} 个文件`);

        const chapters: Chapter[] = chapterFiles
          .filter((file) => path.extname(file).toLowerCase() === ".mp3")
          .map((file, chapterIndex) => ({
            id: `${index + 1}-${chapterIndex + 1}`,
            title: path.basename(file, ".mp3"),
            fileName: path.join("/audiobooks", bookDir, file),
            bookTitle: bookDir,
            book: {
              id: (index + 1).toString(),
              title: bookDir,
              chapters: [], // This will be populated later
            },
          }));

        if (chapters.length > 0) {
          console.log(`${bookDir} 包含 ${chapters.length} 个章节`);
          books.push({
            id: (index + 1).toString(),
            title: bookDir,
            chapters,
          });
        } else {
          console.log(`${bookDir} 没有有效的章节，跳过`);
        }
      } else {
        console.log(`${bookDir} 不是一个目录，跳过`);
      }
    }

    console.log(`扫描完成，共找到 ${books.length} 本有声书`);

    // Save the result to cache file
    await fs.writeFile(cacheFilePath, JSON.stringify(books), "utf-8");
    console.log("有声书数据已保存到缓存文件");

    return books;
  } catch (error) {
    console.error("读取有声书目录时出错：", error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params?: { id?: string[] } },
) {
  try {
    const audiobooks = await getAudiobooks();
    const id = params?.id?.[0];

    if (id) {
      const audiobook = audiobooks.find((book) => book.id === id);
      if (audiobook) {
        return NextResponse.json(audiobook);
      }
      return NextResponse.json({ message: "未找到有声书" }, { status: 404 });
    } else {
      return NextResponse.json(audiobooks);
    }
  } catch (error) {
    console.error("处理请求时出错:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
