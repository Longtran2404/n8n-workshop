import React from "react";
import clsx from "clsx";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: "default" | "success" | "warning" | "danger";
};

export function Badge({ color = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
  "inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-tight",
  color === "default" && "bg-neutral-100 text-neutral-700",
        color === "success" && "bg-green-100 text-green-800",
        color === "warning" && "bg-yellow-100 text-yellow-800",
        color === "danger" && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    />
  );
}
