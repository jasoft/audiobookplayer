import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Chapter } from "./types";

interface AudioPlayerProps {
  chapter: Chapter;
  onReturn: () => void;
}

import { useState } from "react";

export function AudioPlayer({ chapter, onReturn }: AudioPlayerProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(
    chapter.book.chapters.findIndex((ch) => ch.id === chapter.id),
  );

  const handleNextChapter = () => {
    if (currentChapterIndex < chapter.book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const currentChapter = chapter.book.chapters[currentChapterIndex];

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-background p-4 shadow-lg">
      <Button variant="ghost" onClick={onReturn} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <h2 className="rounded-sm bg-slate-100 p-1 text-xl font-semibold">
          返回章节列表
        </h2>
      </Button>
      {currentChapter ? (
        <h2 className="mb-4 text-center text-xl font-semibold">
          {currentChapter.bookTitle} - {currentChapter.title}
        </h2>
      ) : (
        <h2 className="mb-4 text-center text-xl font-semibold">未找到章节</h2>
      )}

      {currentChapter && (
        <H5AudioPlayer
          autoPlay
          showSkipControls={true}
          src={currentChapter.fileName}
          onEnded={handleNextChapter}
          onClickNext={handleNextChapter}
          onClickPrevious={handlePreviousChapter}
        />
      )}
    </div>
  );
}
