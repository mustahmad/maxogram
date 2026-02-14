"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import SettingsMenu from "@/components/settings/SettingsMenu";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-2"
      >
        <Settings size={24} className="text-foreground" aria-hidden="true" />
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </motion.div>

      <SettingsMenu />
    </div>
  );
}
