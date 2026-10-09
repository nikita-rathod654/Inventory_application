"use client";

import { useEffect, useState } from "react";

export default function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(
      new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
  }, [iso]);

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text || "\u00A0"}
    </time>
  );
}