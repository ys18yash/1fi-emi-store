import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "accent" | "neutral" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-semibold rounded-full";
  
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  const variantStyles = {
    primary: "bg-purple-100 text-purple-900 border border-purple-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    accent: "bg-amber-50 text-amber-800 border border-amber-200",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200",
    outline: "bg-white text-gray-900 border border-gray-300",
  };

  return (
    <span
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
