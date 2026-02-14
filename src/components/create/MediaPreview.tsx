"use client";

import { useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  previewUrls: string[];
  onRemove: (index: number) => void;
}

export default function MediaPreview({
  previewUrls,
  onRemove,
}: MediaPreviewProps) {
  const handleRemove = useCallback(
    (index: number) => {
      onRemove(index);
    },
    [onRemove],
  );

  if (previewUrls.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
        <p className="text-sm text-muted-foreground">No media selected</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "grid gap-2",
        previewUrls.length === 1
          ? "grid-cols-1"
          : previewUrls.length === 2
            ? "grid-cols-2"
            : "grid-cols-2 sm:grid-cols-3",
      )}
    >
      <AnimatePresence mode="popLayout">
        {previewUrls.map((url, index) => (
          <motion.div
            key={url}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
          >
            {/* Preview image or video */}
            {url.startsWith("blob:") ? (
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 200px"
                unoptimized
              />
            ) : (
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 200px"
              />
            )}

            {/* Remove button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRemove(index)}
              className={cn(
                "absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full",
                "bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80",
                "opacity-0 group-hover:opacity-100 focus:opacity-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
              aria-label={`Remove image ${index + 1}`}
            >
              <X size={14} />
            </motion.button>

            {/* Index indicator */}
            {previewUrls.length > 1 && (
              <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white backdrop-blur-sm">
                {index + 1}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
