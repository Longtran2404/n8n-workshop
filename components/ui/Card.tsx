import React from "react";
import clsx from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "subtle" | "featured" | "gradient";
  image?: string | null;
  meta?: string;
  title?: string;
  subtitle?: string;
  hoverable?: boolean;
  animated?: boolean;
};

export function Card({ 
  variant = "default", 
  className, 
  image = null, 
  title, 
  subtitle, 
  meta, 
  children, 
  hoverable = true,
  animated = true,
  ...props 
}: CardProps) {
  return (
    <article
      className={clsx(
        "group relative overflow-hidden bg-white transition-all duration-500 ease-out",
        
        // Base styles
        "rounded-2xl border border-gray-200/60",
        
        // Variants
        variant === "default" && "shadow-lg",
        variant === "subtle" && "bg-gray-50/50 border-gray-100 shadow-md",
        variant === "featured" && "shadow-xl border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30",
        variant === "gradient" && "bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200/50 shadow-xl",
        
        // Hover effects
        hoverable && "cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]",
        hoverable && variant === "featured" && "hover:shadow-blue-500/20",
        hoverable && variant === "gradient" && "hover:shadow-purple-500/20",
        
        // Animations
        animated && "animate-fade-in-up",
        
        className
      )}
      {...props}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)] opacity-30" />
      
      {/* Image section */}
      {image ? (
        <div className="relative h-48 w-full overflow-hidden">
          <div 
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url(${image})` }} 
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {meta && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                {meta}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-end p-6">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <div className="text-sm font-medium text-gray-500">{meta || "Placeholder"}</div>
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="relative p-6">
        {title && (
          <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">
            {subtitle}
          </p>
        )}
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
        
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Hover glow effect */}
      {hoverable && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10" />
      )}
    </article>
  );
}
