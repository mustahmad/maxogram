"use client";

import Image from "next/image";
import DoubleTapLike from "@/components/shared/DoubleTapLike";
import ImageCarousel from "@/components/shared/ImageCarousel";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { cn } from "@/lib/utils";
import type { PostMedia, PostType } from "@/types";

interface PostCardMediaProps {
  media: PostMedia[];
  type: PostType;
  onDoubleTap: () => void;
}

export default function PostCardMedia({
  media,
  type,
  onDoubleTap,
}: PostCardMediaProps) {
  if (type === "text" || media.length === 0) {
    return null;
  }

  const renderMedia = () => {
    if (type === "video" && media[0]) {
      return (
        <VideoPlayer
          src={media[0].url}
          poster={media[0].thumbnailUrl}
          className="aspect-square w-full"
        />
      );
    }

    if (type === "carousel" && media.length > 1) {
      return (
        <ImageCarousel
          images={media.map((m) => ({
            url: m.url,
            width: m.width,
            height: m.height,
          }))}
        />
      );
    }

    // Single image (photo type or single-media carousel)
    const image = media[0];
    if (!image) return null;

    return (
      <div className="aspect-square w-full">
        <Image
          src={image.url}
          alt="Post image"
          width={image.width}
          height={image.height}
          className={cn("h-full w-full object-cover")}
          draggable={false}
          priority
        />
      </div>
    );
  };

  return (
    <DoubleTapLike onDoubleTap={onDoubleTap}>
      {renderMedia()}
    </DoubleTapLike>
  );
}
