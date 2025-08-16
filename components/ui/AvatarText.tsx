import React from "react";

export function AvatarText({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-bold w-10 h-10 text-lg ${className}`}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
