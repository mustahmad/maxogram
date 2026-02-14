"use client";

import { motion } from "framer-motion";
import { PlusSquare } from "lucide-react";
import CreatePostForm from "@/components/create/CreatePostForm";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-[600px] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-3"
      >
        <PlusSquare size={24} className="text-foreground" />
        <h1 className="text-xl font-bold text-foreground">Create New Post</h1>
      </motion.div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CreatePostForm />
      </div>
    </div>
  );
}
