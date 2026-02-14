"use client";

import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVideoAutoplay } from "@/hooks/useVideoAutoplay";
import Avatar from "@/components/ui/Avatar";
import ReelActions from "./ReelActions";
import ReelInfo from "./ReelInfo";
import type { Reel } from "@/types";

interface ReelCardProps {
  /** Reel data */
  reel: Reel;
  /** Whether this reel is currently in view / active */
  isActive: boolean;
  /** Like toggle callback */
  onLike?: () => void;
  /** Comment callback */
  onComment?: () => void;
  /** Share callback */
  onShare?: () => void;
  /** Save callback */
  onSave?: () => void;
}

export default function ReelCard({
  reel,
  isActive,
  onLike,
  onComment,
  onShare,
  onSave,
}: ReelCardProps) {
  const videoRef = useVideoAutoplay();
  const [isPaused, setIsPaused] = useState(false);
  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toggle play/pause on tap
  const handleTap = useCallback(() => {
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

  // Pause video when not active
  if (!isActive && videoRef.current && !videoRef.current.paused) {
    videoRef.current.pause();
  }

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        onClick={handleTap}
        aria-label={`Reel by ${reel.author.username}`}
      />

      {/* Pause indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlays for readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Right side: avatar + actions */}
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
        {/* Author avatar */}
        <Avatar
          src={reel.author.avatarUrl}
          alt={reel.author.displayName}
          size="md"
          hasStory
        />

        {/* Action buttons */}
        <ReelActions
          reel={reel}
          onLike={onLike ?? (() => {})}
          onComment={onComment ?? (() => {})}
          onShare={onShare ?? (() => {})}
          onSave={onSave ?? (() => {})}
        />
      </div>

      {/* Bottom-left: reel info */}
      <div className="absolute bottom-20 left-3">
        <ReelInfo
          author={reel.author.username}
          caption={reel.caption}
          audioName={reel.audioName}
        />
      </div>
    </div>
  );
}
