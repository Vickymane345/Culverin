"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="rounded-full border border-line px-2.5 py-1 font-sans text-xs text-muted hover:border-accent hover:text-accent"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
