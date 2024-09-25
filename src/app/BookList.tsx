import { useState } from "react";
import { ChevronRight, ChevronDown, Book, FileText } from "lucide-react";
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
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">我的有声书</h2>
        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <div
                className="flex cursor-pointer items-center px-1 py-2 hover:bg-gray-100"
                onClick={() => toggleBook(book.id)}
              >
                {expandedBooks.includes(book.id) ? (
                  <ChevronDown className="mr-2 h-5 w-5 text-primary" />
                ) : (
                  <ChevronRight className="mr-2 h-5 w-5 text-primary" />
                )}
                <Book className="mr-2 h-5 w-5 text-primary" />
                <span className="font-medium">{book.title}</span>
              </div>
              {expandedBooks.includes(book.id) && (
                <ul className="space-y-1 py-2 pl-8">
                  {book.chapters.map((chapter, index) => (
                    <li
                      key={index}
                      className="flex cursor-pointer items-center text-sm text-gray-600 hover:text-primary"
                      onClick={() => onChapterSelect(book.id, chapter.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
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
