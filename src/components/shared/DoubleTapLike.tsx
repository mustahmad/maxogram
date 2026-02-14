"use client";

import { useState, type ReactNode } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDoubleTap } from "@/hooks/useDoubleTap";

interface DoubleTapLikeProps {
  onDoubleTap: () => void;
  children: ReactNode;
}

const heartVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 1.4, opacity: 0 },
} as const;

export default function DoubleTapLike({
  onDoubleTap,
  children,
}: DoubleTapLikeProps) {
  const [showHeart, setShowHeart] = useState(false);

  const { onClick } = useDoubleTap(() => {
    onDoubleTap();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  });

  return (
    <div className="relative" onClick={onClick} role="presentation">
      {children}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              variants={heartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              <Heart
                size={80}
                className="fill-white text-white drop-shadow-lg"
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
