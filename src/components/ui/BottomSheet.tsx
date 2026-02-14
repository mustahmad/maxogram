"use client";

import {
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  isOpen: boolean;
  /** Called when the bottom sheet should close */
  onClose: () => void;
  /** Optional title rendered in the sheet header */
  title?: string;
  /** Sheet body content */
  children: ReactNode;
  /** Additional classes for the content container */
  className?: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const sheetVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring" as const, damping: 30, stiffness: 350 },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
} as const;

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const dragControls = useDragControls();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || "Bottom sheet"}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_event, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-t-2xl bg-card shadow-xl",
              "max-h-[85vh] overflow-hidden",
              "border-t border-x border-border",
              className,
            )}
          >
            {/* Drag handle */}
            <div
              className="flex cursor-grab items-center justify-center py-3 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
              aria-label="Drag to dismiss"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onClose();
                }
              }}
            >
              <div className="h-1 w-10 rounded-full bg-muted-foreground/40" />
            </div>

            {/* Title */}
            {title && (
              <div className="border-b border-border px-4 pb-3">
                <h2 className="text-center text-base font-semibold text-card-foreground">
                  {title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto overscroll-contain px-4 pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
