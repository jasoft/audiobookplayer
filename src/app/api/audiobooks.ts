import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import type { Audiobook, Chapter } from "../types";

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
              title: path.basename(file, ".mp3"),
              fileName: file,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Audiobook[] | Audiobook | { message: string }>,
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const audiobooks = await getAudiobooks();

      if (id) {
        // 如果提供了id，返回特定的有声书
        const audiobook = audiobooks.find((book) => book.id === id);
        if (audiobook) {
          res.status(200).json(audiobook);
        } else {
          res.status(404).json({ message: "未找到指定的有声书" });
        }
      } else {
        // 如果没有提供id，返回所有有声书的列表
        res.status(200).json(audiobooks);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ message: "服务器内部错误" });
    }
  } else {
    // 对于非GET请求，返回405 Method Not Allowed
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
