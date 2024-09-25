import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowLeft,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";

interface AudioPlayerProps {
  chapterTitle: string;
  onReturn: () => void;
}

export function AudioPlayer({ chapterTitle, onReturn }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("45:30"); // 假设音频总长度为45分30秒

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prevProgress + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    updateCurrentTime(progress);
  }, [progress]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setProgress((prevProgress) => Math.max(prevProgress - 5, 0));
  };

  const handleSkipForward = () => {
    setProgress((prevProgress) => Math.min(prevProgress + 5, 100));
  };

  const updateCurrentTime = (newProgress: number) => {
    const minutes = Math.floor((newProgress / 100) * 45.5);
    const seconds = Math.floor(((newProgress / 100) * 45.5 - minutes) * 60);
    setCurrentTime(
      `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    );
  };

  const handleProgressChange = (value: number[]) => {
    if (value[0] !== undefined) {
      setProgress(value[0]);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-background p-4 shadow-lg">
      <Button variant="ghost" onClick={onReturn} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回章节列表
      </Button>
      <h2 className="mb-4 text-center text-xl font-semibold">{chapterTitle}</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          className="w-full"
          onValueChange={handleProgressChange}
        />
        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleSkipBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipForward}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
