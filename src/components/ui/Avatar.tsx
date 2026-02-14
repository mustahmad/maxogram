"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
};

const onlineDotSizeMap: Record<AvatarSize, string> = {
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-[1.5px]",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
};

const fontSizeMap: Record<AvatarSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-xl",
  xl: "text-3xl",
};

interface AvatarProps {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the avatar image */
  alt: string;
  /** Avatar size variant */
  size?: AvatarSize;
  /** Show a green online indicator dot */
  showOnline?: boolean;
  /** Show a gradient story ring around the avatar */
  hasStory?: boolean;
  /** Show a gray ring indicating the story was already viewed */
  storyViewed?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export default function Avatar({
  src,
  alt,
  size = "md",
  showOnline = false,
  hasStory = false,
  storyViewed = false,
  className,
  onClick,
}: AvatarProps) {
  const px = sizeMap[size];

  const imageElement = (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-muted",
        className,
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold",
            fontSizeMap[size],
          )}
          role="img"
          aria-label={alt}
        >
          {alt.charAt(0).toUpperCase()}
        </div>
      )}

      {showOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-green-500 border-background",
            onlineDotSizeMap[size],
          )}
          aria-label="Online"
        />
      )}
    </div>
  );

  const withRing = hasStory || storyViewed;

  const wrapped = withRing ? (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        storyViewed ? "story-ring-viewed" : "story-ring",
      )}
      style={{ padding: size === "sm" ? 2 : size === "md" ? 2.5 : 3 }}
    >
      <div
        className="rounded-full bg-background"
        style={{ padding: size === "sm" ? 1 : 2 }}
      >
        {imageElement}
      </div>
    </div>
  ) : (
    imageElement
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={alt}
      >
        {wrapped}
      </button>
    );
  }

  return wrapped;
}
