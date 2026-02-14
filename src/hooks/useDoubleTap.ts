"use client";

import { useCallback, useRef } from "react";

export function useDoubleTap(
  callback: () => void,
  delay: number = 300
): { onClick: () => void } {
  const lastTapRef = useRef<number>(0);

  const onClick = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current <= delay) {
      lastTapRef.current = 0;
      callback();
    } else {
      lastTapRef.current = now;
    }
  }, [callback, delay]);

  return { onClick };
}
