"use client";

import ReelsContainer from "@/components/reels/ReelsContainer";

/**
 * Reels page — full-screen vertical video feed.
 *
 * Uses negative margins to override any parent padding from the
 * main layout so the reels fill the entire viewport.
 */
export default function ReelsPage() {
  return (
    <div className="-mx-0 -mt-0 h-[100dvh] overflow-hidden lg:-mb-0">
      {/*
        Override parent layout padding by making this container
        position fixed on mobile so it covers the entire screen.
      */}
      <div className="fixed inset-0 z-30 bg-black lg:relative lg:inset-auto lg:z-auto">
        <ReelsContainer />
      </div>
    </div>
  );
}
