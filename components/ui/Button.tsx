import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden",
        "transform hover:-translate-y-1 active:translate-y-0",
        
        // Variants
        variant === "primary" && "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl",
        variant === "secondary" && "bg-gray-100 text-gray-900 shadow-md hover:bg-gray-200 hover:shadow-lg",
        variant === "outline" && "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg",
        variant === "ghost" && "text-blue-600 bg-transparent hover:bg-blue-50 shadow-none",
        variant === "gradient" && "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl bg-[length:200%_200%] hover:bg-[position:100%_0%] transition-all duration-500",
        
        // Sizes
        size === "sm" && "px-4 py-2 text-sm rounded-lg",
        size === "md" && "px-6 py-3 text-base rounded-xl",
        size === "lg" && "px-8 py-4 text-lg rounded-xl",
        
        // Full width
        fullWidth && "w-full",
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for gradient variant */}
      {variant === "gradient" && (
        <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={clsx("relative z-10", loading && "opacity-0")}>
        {children}
      </span>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-25 bg-white transition-opacity duration-150" />
    </button>
  );
}