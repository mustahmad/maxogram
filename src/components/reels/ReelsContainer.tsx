"use client";

import { useCallback, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReelStore } from "@/stores/useReelStore";
import ReelCard from "./ReelCard";

export default function ReelsContainer() {
  const { reels, activeIndex, isLoading, fetchReels, likeReel, setActiveIndex } =
    useReelStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Fetch reels on mount
  useEffect(() => {
    fetchReels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which reel is in view using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container || reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) {
              setActiveIndex(index);
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    reelRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels, setActiveIndex]);

  const setReelRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) {
        reelRefs.current.set(index, el);
      } else {
        reelRefs.current.delete(index);
      }
    },
    []
  );

  const handleLike = useCallback(
    (id: string) => {
      likeReel(id);
    },
    [likeReel]
  );

  if (isLoading && reels.length === 0) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "scrollbar-hide h-[100dvh] snap-y snap-mandatory overflow-y-scroll bg-black",
        "mx-auto lg:max-w-[450px]"
      )}
    >
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          ref={setReelRef(index)}
          data-index={index}
          className="h-[100dvh] snap-start"
        >
          <ReelCard
            reel={reel}
            isActive={index === activeIndex}
            onLike={() => handleLike(reel.id)}
            onComment={() => {
              // Could open a comments bottom sheet
              console.log("Open comments for reel:", reel.id);
            }}
            onShare={() => {
              // Could open a share sheet
              console.log("Share reel:", reel.id);
            }}
            onSave={() => {
              // Could toggle save
              console.log("Save reel:", reel.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
