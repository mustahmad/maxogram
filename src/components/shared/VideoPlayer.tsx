"use client";

import { useState, useCallback } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  className,
}: VideoPlayerProps) {
  const videoRef = useVideoAutoplay();
  const [isPaused, setIsPaused] = useState(true);

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, [videoRef]);

  const handlePlay = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  return (
    <div
      className={cn("relative w-full cursor-pointer", className)}
      onClick={handleTogglePlay}
      role="button"
      tabIndex={0}
      aria-label={isPaused ? "Play video" : "Pause video"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTogglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        className="h-full w-full object-cover"
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Play
              size={32}
              className="ml-1 fill-white text-white"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
}
