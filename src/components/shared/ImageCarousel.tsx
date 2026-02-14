"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipe } from "@/hooks/useSwipe";
import Image from "next/image";

interface CarouselImage {
  url: string;
  width: number;
  height: number;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  });

  if (images.length === 0) return null;

  return (
    <div
      className="group relative w-full overflow-hidden"
      {...swipeHandlers}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="aspect-square w-full shrink-0"
          >
            <Image
              src={image.url}
              alt={`Slide ${index + 1} of ${images.length}`}
              width={image.width}
              height={image.height}
              className="h-full w-full object-cover"
              draggable={false}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          type="button"
          onClick={goToPrev}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2",
            "hidden items-center justify-center rounded-full",
            "h-8 w-8 bg-black/50 text-white backdrop-blur-sm",
            "transition-opacity hover:bg-black/70",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            "group-hover:flex"
          )}
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          type="button"
          onClick={goToNext}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "hidden items-center justify-center rounded-full",
            "h-8 w-8 bg-black/50 text-white backdrop-blur-sm",
            "transition-opacity hover:bg-black/70",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            "group-hover:flex"
          )}
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/40"
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  );
}
