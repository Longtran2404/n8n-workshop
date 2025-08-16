import React from "react";
import clsx from "clsx";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  variant?: "default" | "alt";
};

export function Section({ variant = "default", className, ...props }: SectionProps) {
  return (
    <section
      className={clsx(
        "py-12 px-4 sm:px-8 md:px-16",
        variant === "alt" && "bg-neutral-50",
        className
      )}
      {...props}
    />
  );
}
