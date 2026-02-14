"use client";

import { timeAgo } from "@/lib/utils";

interface TimeAgoProps {
  date: string;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  return (
    <time
      dateTime={date}
      className="text-xs text-muted-foreground"
      title={new Date(date).toLocaleString()}
    >
      {timeAgo(date)}
    </time>
  );
}
