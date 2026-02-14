"use client";

import FeedContainer from "@/components/feed/FeedContainer";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  return (
    <div className={cn("mx-auto w-full max-w-[630px]")}>
      <FeedContainer />
    </div>
  );
}
