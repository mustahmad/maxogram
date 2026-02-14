"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  id: string;
}

function ToggleSwitch({ enabled, onToggle, id }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={enabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        enabled ? "bg-accent" : "bg-muted-foreground/30"
      )}
    >
      <motion.div
        className="h-5 w-5 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 22 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
}

const privacyOptions: PrivacySetting[] = [
  {
    id: "private-account",
    label: "Private Account",
    description:
      "When your account is private, only people you approve can see your photos and videos.",
  },
  {
    id: "activity-status",
    label: "Activity Status",
    description:
      "Allow accounts you follow and anyone you message to see when you were last active.",
  },
  {
    id: "read-receipts",
    label: "Read Receipts",
    description:
      "Let others know when you have read their messages.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PrivacySettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    "private-account": false,
    "activity-status": true,
    "read-receipts": true,
  });

  const handleToggle = useCallback((id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col divide-y divide-border"
    >
      {privacyOptions.map((option) => (
        <motion.div
          key={option.id}
          variants={itemVariants}
          className="flex items-center justify-between gap-4 py-4"
        >
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor={option.id}
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {option.label}
            </label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {option.description}
            </p>
          </div>
          <ToggleSwitch
            id={option.id}
            enabled={settings[option.id]}
            onToggle={() => handleToggle(option.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
