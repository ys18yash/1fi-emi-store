"use strict";

import React from "react";
import Link from "next/link";
import clsx from "clsx";

export interface BrandLogoProps {
  href?: string;
  className?: string;
  badgeText?: string;
  size?: "sm" | "md" | "lg";
  isLink?: boolean;
}

/**
 * Canonical 1Fi Brand Logo Component
 * Renders ONLY the official [Purple 1Fi logo icon] + [STORE] badge treatment
 * with consistent typography, green border, and spacing across all themes and viewports.
 */
export function BrandLogo({
  href = "/",
  className,
  badgeText = "STORE",
  size = "md",
  isLink = true,
}: BrandLogoProps) {
  const logoContent = (
    <span className={clsx("inline-flex items-center gap-2 group select-none", className)}>
      {/* Canonical 1Fi Logo Icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/1fi-icon.svg"
        alt="1Fi"
        className={clsx(
          "rounded-lg object-contain shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0",
          size === "sm" && "w-7 h-7",
          size === "md" && "w-8 h-8",
          size === "lg" && "w-9 h-9 sm:w-10 sm:h-10"
        )}
      />

      {/* STORE Badge - Immediately to the right with consistent spacing */}
      {badgeText && (
        <span
          className={clsx(
            "font-bold uppercase tracking-wider text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2 py-0.5 rounded-md border border-[var(--brand-primary)]/20 leading-tight inline-flex items-center self-center",
            size === "sm" && "text-[10px]",
            size === "md" && "text-[11px]",
            size === "lg" && "text-xs"
          )}
        >
          {badgeText}
        </span>
      )}
    </span>
  );

  if (!isLink) {
    return logoContent;
  }

  return (
    <Link href={href} className="inline-flex items-center" aria-label="1Fi Store Homepage">
      {logoContent}
    </Link>
  );
}
