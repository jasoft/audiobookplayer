"use client";

import { useState, useEffect } from "react";
import { BookList } from "./BookList";
import { AudioPlayer } from "./AudioPlayer";
import type { Audiobook } from "./types";
// 定义数据类型

export default function AudiobookApp() {
  const [books, setBooks] = useState<Audiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<{
    bookId: string;
    chapterId: string;
  } | null>(null);

  useEffect(() => {
    // 从API获取有声书数据
    fetch("/api/audiobooks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch audiobooks");
        }
        return response.json();
      })
      .then((data: Audiobook[]) => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching audiobooks:", error);
        setError("Failed to load audiobooks. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const handleChapterSelect = (bookId: string, chapterId: string) => {
    setCurrentChapter({ bookId, chapterId });
  };

  const handleReturnToList = () => {
    setCurrentChapter(null);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading audiobooks...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (currentChapter) {
    const book = books.find((b) => b.id === currentChapter.bookId);
    const chapter = book?.chapters.find(
      (c) => c.id === currentChapter.chapterId,
    );
    const chapterTitle = chapter ? chapter.title : "";

    return (
      <AudioPlayer chapterTitle={chapterTitle} onReturn={handleReturnToList} />
    );
  }

  return <BookList books={books} onChapterSelect={handleChapterSelect} />;
}
