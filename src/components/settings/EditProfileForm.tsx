"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { editProfileSchema, type EditProfileInput } from "@/lib/validators";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const formVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function EditProfileForm() {
  const user = useAuthStore((s) => s.user);
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      bio: user?.bio || "",
      website: user?.website || "",
    },
  });

  const onSubmit = async (data: EditProfileInput) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      addToast("Profile updated successfully!", "success");
    } catch {
      addToast("Failed to update profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar
            src={user?.avatarUrl}
            alt={user?.displayName || "User"}
            size="xl"
          />
          <button
            type="button"
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-full",
              "bg-black/40 opacity-0 transition-opacity hover:opacity-100",
              "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            )}
            aria-label="Change profile photo"
          >
            <Camera size={24} className="text-white" aria-hidden="true" />
          </button>
        </div>
        <span className="text-sm font-medium text-accent cursor-pointer">
          Change Photo
        </span>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Display Name"
          placeholder="Your display name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />

        <Input
          label="Username"
          value={user?.username || ""}
          disabled
          className="opacity-60"
        />

        <Textarea
          label="Bio"
          placeholder="Tell people about yourself..."
          maxRows={4}
          error={errors.bio?.message}
          {...register("bio")}
        />

        <Input
          label="Website"
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register("website")}
        />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        className="mt-2"
      >
        Save Changes
      </Button>
    </motion.form>
  );
}
