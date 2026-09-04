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
    primary: "bg-[#087443]/10 text-[#087443] border border-[#087443]/20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    accent: "bg-[#C4F36A]/20 text-[#111318] border border-[#C4F36A]/40",
    neutral: "bg-[#F7F7F4] text-[#646A73] border border-[#E3E5E2]",
    outline: "bg-white text-[#111318] border border-[#E3E5E2]",
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
