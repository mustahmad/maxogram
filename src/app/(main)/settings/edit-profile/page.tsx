"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import EditProfileForm from "@/components/settings/EditProfileForm";

export default function EditProfilePage() {
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
        <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
      </motion.div>

      <EditProfileForm />
    </div>
  );
}
