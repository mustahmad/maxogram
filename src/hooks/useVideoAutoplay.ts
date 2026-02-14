"use client";

import { useEffect, useRef } from "react";

export function useVideoAutoplay(): React.RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play().catch(() => {
            // Silently handle play() promise rejection.
            // This can occur when the browser blocks autoplay or
            // the element is removed before playback starts.
          });
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.8 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return videoRef;
}
