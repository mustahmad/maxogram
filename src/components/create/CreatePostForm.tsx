"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateStore } from "@/stores/useCreateStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import MediaUploader from "./MediaUploader";
import MediaPreview from "./MediaPreview";
import CaptionEditor from "./CaptionEditor";

const STEP_LABELS = ["Select", "Preview", "Details", "Publish"] as const;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isActive || isCompleted ? "var(--accent-color)" : "var(--muted-bg)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isActive || isCompleted
                    ? "text-white"
                    : "text-muted-foreground",
                )}
              >
                {isCompleted ? <Check size={14} /> : stepNum}
              </motion.div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-accent" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "mb-4 h-0.5 w-8 rounded-full transition-colors",
                  stepNum < currentStep ? "bg-accent" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PublishingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={48} className="text-accent" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-foreground"
      >
        Publishing your post...
      </motion.p>
      <p className="text-sm text-muted-foreground">
        This will only take a moment
      </p>
    </motion.div>
  );
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function CreatePostForm() {
  const router = useRouter();
  const {
    step,
    selectedFiles,
    previewUrls,
    caption,
    tags,
    location,
    isPublishing,
    setFiles,
    setCaption,
    addTag,
    removeTag,
    setLocation,
    nextStep,
    prevStep,
    reset,
    publish,
  } = useCreateStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Do not reset on unmount during publish
    };
  }, []);

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setFiles(files);
      nextStep();
    },
    [setFiles, nextStep],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setFiles(newFiles);
    },
    [selectedFiles, setFiles],
  );

  const handlePublish = useCallback(async () => {
    nextStep(); // Go to step 4 (publishing animation)
    try {
      await publish();
      // On success, redirect after a short delay for UX
      setTimeout(() => {
        reset();
        router.push("/");
      }, 1500);
    } catch {
      // On failure, go back to step 3
      prevStep();
    }
  }, [nextStep, publish, reset, router, prevStep]);

  const canGoNext =
    (step === 1 && selectedFiles.length > 0) ||
    (step === 2 && previewUrls.length > 0) ||
    step === 3;

  // Track animation direction
  const direction = 1;

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Step 1: Upload */}
          {step === 1 && (
            <MediaUploader onFilesSelected={handleFilesSelected} />
          )}

          {/* Step 2: Preview */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Preview & adjust your media
              </h3>
              <MediaPreview
                previewUrls={previewUrls}
                onRemove={handleRemoveFile}
              />
            </div>
          )}

          {/* Step 3: Caption & details */}
          {step === 3 && (
            <div className="space-y-6">
              <CaptionEditor
                caption={caption}
                onCaptionChange={setCaption}
                tags={tags}
                onAddTag={addTag}
                onRemoveTag={removeTag}
              />

              <Input
                label="Location"
                placeholder="Add location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                iconLeft={<MapPin size={16} />}
              />
            </div>
          )}

          {/* Step 4: Publishing */}
          {step === 4 && <PublishingAnimation />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {step < 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between pt-4"
        >
          <div>
            {step > 1 && (
              <Button
                variant="ghost"
                size="md"
                onClick={prevStep}
                iconLeft={<ArrowLeft size={16} />}
              >
                Back
              </Button>
            )}
          </div>

          <div>
            {step === 3 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handlePublish}
                disabled={isPublishing}
                loading={isPublishing}
                iconRight={<Check size={16} />}
              >
                Publish
              </Button>
            ) : step !== 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={nextStep}
                disabled={!canGoNext}
                iconRight={<ArrowRight size={16} />}
              >
                Next
              </Button>
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  );
}
