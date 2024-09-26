import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Chapter } from "./types";

interface AudioPlayerProps {
  chapter: Chapter;
  onReturn: () => void;
}

export function AudioPlayer({ chapter, onReturn }: AudioPlayerProps) {
  return (
    <div className="mx-auto max-w-sm rounded-lg bg-background p-4 shadow-lg">
      <Button variant="ghost" onClick={onReturn} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <h2 className="rounded-sm bg-slate-100 p-1 text-xl font-semibold">
          返回章节列表
        </h2>
      </Button>
      <h2 className="mb-4 text-center text-xl font-semibold">
        {chapter.bookTitle} - {chapter.title}
      </h2>

      <H5AudioPlayer autoPlay src={chapter.fileName} />
    </div>
  );
}
