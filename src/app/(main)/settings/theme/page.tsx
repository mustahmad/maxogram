"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Type, ImageIcon, Heart } from "lucide-react";
import ThemeToggle from "@/components/settings/ThemeToggle";

export default function ThemePage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-3"
      >
        <Link
          href="/settings"
          className="rounded-lg p-1.5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Back to settings"
        >
          <ArrowLeft size={20} className="text-foreground" aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Appearance</h1>
      </motion.div>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Choose your theme
          </h2>
          <ThemeToggle />
        </section>

        {/* Preview card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Preview
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Simulated post header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-9 w-9 rounded-full bg-brand-gradient" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-card-foreground">
                  maxogram
                </span>
                <span className="text-xs text-muted-foreground">
                  San Francisco
                </span>
              </div>
            </div>

            {/* Simulated image area */}
            <div className="flex aspect-square items-center justify-center bg-muted">
              <ImageIcon
                size={48}
                className="text-muted-foreground/40"
                aria-hidden="true"
              />
            </div>

            {/* Simulated actions */}
            <div className="flex items-center gap-4 px-4 py-3">
              <Heart size={22} className="text-card-foreground" aria-hidden="true" />
              <Type size={22} className="text-card-foreground" aria-hidden="true" />
            </div>

            <div className="px-4 pb-3">
              <p className="text-sm text-card-foreground">
                <span className="font-semibold">maxogram</span>{" "}
                This is how your feed will look.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
