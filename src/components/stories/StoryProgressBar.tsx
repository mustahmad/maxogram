"use client";

import { cn } from "@/lib/utils";

interface StoryProgressBarProps {
  total: number;
  current: number;
  progress: number;
}

export default function StoryProgressBar({
  total,
  current,
  progress,
}: StoryProgressBarProps) {
  return (
    <div className="flex w-full gap-1 px-2" aria-label="Story progress">
      {Array.from({ length: total }).map((_, index) => {
        let barProgress: number;
        if (index < current) {
          barProgress = 1;
        } else if (index === current) {
          barProgress = progress;
        } else {
          barProgress = 0;
        }

        return (
          <div
            key={index}
            className={cn(
              "h-0.5 flex-1 overflow-hidden rounded-full",
              "bg-white/30"
            )}
          >
            <div
              className="h-full rounded-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${barProgress * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
