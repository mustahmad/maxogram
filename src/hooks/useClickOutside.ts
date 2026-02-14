"use client";

import { type RefObject, useEffect } from "react";

export function useClickOutside(
  ref: RefObject<Element | null>,
  callback: () => void
): void {
  useEffect(() => {
    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      callback();
    };

    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
    };
  }, [ref, callback]);
}
