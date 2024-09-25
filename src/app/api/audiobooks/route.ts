import fs from "fs/promises";
import path from "path";
import type { Audiobook, Chapter } from "~/app/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 设置有声书目录的路径
const AUDIOBOOKS_DIR = path.join(process.cwd(), "public", "audiobooks");
console.log(AUDIOBOOKS_DIR);

async function getAudiobooks(): Promise<Audiobook[]> {
  try {
    const bookDirs = await fs.readdir(AUDIOBOOKS_DIR);
    const books: Audiobook[] = (
      await Promise.all(
        bookDirs.map(async (bookDir, index) => {
          const bookPath = path.join(AUDIOBOOKS_DIR, bookDir);
          const stats = await fs.stat(bookPath);
          if (!stats.isDirectory()) {
            return null;
          }
          const chapterFiles = await fs.readdir(bookPath);
          const chapters: Chapter[] = chapterFiles
            .filter((file) => path.extname(file).toLowerCase() === ".mp3")
            .map((file, chapterIndex) => ({
              id: `${index + 1}-${chapterIndex + 1}`,
              title: path.join(bookDir, path.basename(file, ".mp3")),
              fileName: path.join("/audiobooks", bookDir, file),
            }));
          return {
            id: (index + 1).toString(),
            title: bookDir,
            chapters,
          };
        }),
      )
    ).filter((book): book is Audiobook => book !== null);
    return books;
  } catch (error) {
    console.error("Error reading audiobooks directory:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const audiobooks = await getAudiobooks();
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      // 如果提供了id，返回特定的有声书
      const audiobook = audiobooks.find((book) => book.id === id);
      if (audiobook) {
        return NextResponse.json(audiobook);
      }
    } else {
      // 如果没有提供id，返回所有有声书的列表
      return NextResponse.json(audiobooks);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
