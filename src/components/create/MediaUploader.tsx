"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export default function MediaUploader({ onFilesSelected }: MediaUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const validFiles = Array.from(fileList).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("video/"),
      );

      if (validFiles.length > 0) {
        setSelectedCount(validFiles.length);
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset the input so the same files can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [handleFiles],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          isDragOver
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-border bg-muted/30 hover:border-muted-foreground hover:bg-muted/50",
        )}
      >
        <motion.div
          animate={isDragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isDragOver ? (
            <ImagePlus size={48} className="text-accent" />
          ) : (
            <Upload size={48} className="text-muted-foreground" />
          )}
        </motion.div>

        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isDragOver ? "Drop files here" : "Drag photos and videos here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to select from your device
          </p>
        </div>

        {selectedCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-accent"
          >
            {selectedCount} {selectedCount === 1 ? "file" : "files"} selected
          </motion.p>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        aria-label="Select photos or videos"
      />
    </motion.div>
  );
}
