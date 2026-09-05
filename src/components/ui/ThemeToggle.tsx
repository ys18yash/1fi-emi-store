"use strict";
"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer group flex items-center justify-center bg-[var(--bg-surface)] text-[var(--brand-primary)] border-[var(--border-subtle)] shadow-premium-xs ${className}`}
        aria-label="Toggle theme mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer group flex items-center justify-center ${
        isDark
          ? "bg-[#192722] hover:bg-[#1F302A] text-[#B7F34A] border-[#1E2D27] shadow-xs hover:border-[#10B981]/40"
          : "bg-white hover:bg-[#F0F2EE] text-[#087443] border-[#E3E5E2] shadow-premium-xs hover:border-[#087443]/40"
      } ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
}
