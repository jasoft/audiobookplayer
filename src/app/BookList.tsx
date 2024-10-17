import { useState } from "react";
import { Book, FileText } from "lucide-react";
import type { Audiobook } from "./types";

interface BookListProps {
  books: Audiobook[];
  onChapterSelect: (bookId: string, chapterIndex: string) => void;
}

export function BookList({ books, onChapterSelect }: BookListProps) {
  const [expandedBooks, setExpandedBooks] = useState<string[]>([]);

  const toggleBook = (bookId: string) => {
    setExpandedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="p-2">
        <h2 className="mb-2 mt-2 text-center text-3xl font-bold text-gray-800">
          我的有声书
        </h2>
        <ul className="space-y-4">
          {books.map((book) => (
            <li
              key={book.id}
              className="border-b border-gray-300 last:border-b-0"
            >
              <div
                className="flex cursor-pointer items-center px-1 py-2 transition-colors duration-200 hover:bg-gray-50"
                onClick={() => toggleBook(book.id)}
              >
                <Book className="mr-3 h-8 w-8 flex-shrink-0 text-indigo-500" />
                <span className="text-xl font-medium text-gray-700">
                  {book.title}
                </span>
              </div>
              {expandedBooks.includes(book.id) && (
                <ul className="space-y-2 py-3">
                  {book.chapters.map((chapter, index) => (
                    <li
                      key={index}
                      className="flex cursor-pointer items-center rounded-md bg-gray-100 p-3 text-lg text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-indigo-600"
                      onClick={() => onChapterSelect(book.id, chapter.id)}
                    >
                      <FileText className="ml-5 mr-3 h-5 w-5 text-yellow-400" />
                      {chapter.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
