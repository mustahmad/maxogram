"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useStoryStore } from "@/stores/useStoryStore";
import Avatar from "@/components/ui/Avatar";
import StoryProgressBar from "@/components/stories/StoryProgressBar";
import TimeAgo from "@/components/shared/TimeAgo";

const STORY_DURATION = 5000; // 5 seconds for images
const TICK_INTERVAL = 50; // Update progress every 50ms

export default function StoryViewer() {
  const storyGroups = useStoryStore((s) => s.storyGroups);
  const activeGroupIndex = useStoryStore((s) => s.activeGroupIndex);
  const activeStoryIndex = useStoryStore((s) => s.activeStoryIndex);
  const closeViewer = useStoryStore((s) => s.closeViewer);
  const nextStory = useStoryStore((s) => s.nextStory);
  const prevStory = useStoryStore((s) => s.prevStory);
  const markViewed = useStoryStore((s) => s.markViewed);

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeGroup =
    activeGroupIndex !== null ? storyGroups[activeGroupIndex] : null;
  const activeStory = activeGroup?.stories[activeStoryIndex] ?? null;
  const isVideo = activeStory?.mediaType === "video";
  const duration = activeStory?.duration
    ? activeStory.duration * 1000
    : STORY_DURATION;

  // Mark story as viewed when it becomes active
  useEffect(() => {
    if (activeStory && !activeStory.isViewed) {
      markViewed(activeStory.id);
    }
  }, [activeStory, markViewed]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || !activeStory) return;

    setProgress(0);
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        nextStory();
      }
    }, TICK_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStory?.id, isPaused, duration, nextStory, activeStory]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          nextStory();
          break;
        case "ArrowLeft":
          prevStory();
          break;
        case "Escape":
          closeViewer();
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nextStory, prevStory, closeViewer]);

  // Pause/resume video along with timer
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isPaused, isVideo]);

  const handleLeftTap = useCallback(() => {
    prevStory();
  }, [prevStory]);

  const handleRightTap = useCallback(() => {
    nextStory();
  }, [nextStory]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  if (!activeGroup || !activeStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Story content */}
        <div className="relative h-full w-full max-w-lg">
          {/* Story media */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={activeStory.mediaUrl}
                  className="h-full w-full object-contain"
                  muted
                  playsInline
                  autoPlay
                />
              ) : (
                <Image
                  src={activeStory.mediaUrl}
                  alt={`Story by ${activeGroup.user.username}`}
                  fill
                  className="object-contain"
                  priority
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Top overlay: progress + user info */}
          <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 to-transparent pb-8 pt-3">
            {/* Progress bars */}
            <StoryProgressBar
              total={activeGroup.stories.length}
              current={activeStoryIndex}
              progress={progress}
            />

            {/* User info + controls */}
            <div className="mt-3 flex items-center gap-3 px-4">
              <Avatar
                src={activeGroup.user.avatarUrl}
                alt={activeGroup.user.displayName}
                size="sm"
              />
              <span className="text-sm font-semibold text-white">
                {activeGroup.user.username}
              </span>
              <TimeAgo date={activeStory.createdAt} />

              <div className="flex-1" />

              {/* Pause/Play button */}
              <button
                type="button"
                onClick={handlePauseToggle}
                className="rounded-full p-1 text-white hover:bg-white/20"
                aria-label={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={closeViewer}
                className={cn(
                  "rounded-full p-1 text-white hover:bg-white/20",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                )}
                aria-label="Close story viewer"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Left/Right tap zones */}
          <div
            className="absolute bottom-0 left-0 top-20 z-[5] w-1/3 cursor-pointer"
            onClick={handleLeftTap}
            role="button"
            tabIndex={-1}
            aria-label="Previous story"
          />
          <div
            className="absolute bottom-0 right-0 top-20 z-[5] w-1/3 cursor-pointer"
            onClick={handleRightTap}
            role="button"
            tabIndex={-1}
            aria-label="Next story"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
