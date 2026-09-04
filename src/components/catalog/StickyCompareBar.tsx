"use strict";
"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/WishlistCompareContext";
import { Scale, ArrowRight, X, Trash2 } from "lucide-react";

export function StickyCompareBar() {
  const { compareSlugs, removeFromCompare, clearCompare, count, maxCount } = useCompare();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 bg-[#101A17] text-white rounded-2xl p-3.5 sm:px-6 sm:py-4 shadow-2xl border border-[#1F2E27] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 animate-in slide-in-from-bottom-4 duration-200 max-w-2xl w-full">
      {/* Left: Info & Chips */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#087443] text-white shadow-premium-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold block text-white">
              Compare Models ({count}/{maxCount})
            </span>
            <span className="text-[10px] text-[#8D95A0] block sm:hidden">
              Up to 3 devices side-by-side
            </span>
          </div>
        </div>

        {/* Selected Slugs Pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {compareSlugs.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#172420] text-white px-2.5 py-1 rounded-lg border border-[#1F2E27]"
            >
              <span className="capitalize">{slug.replace(/-/g, " ")}</span>
              <button
                type="button"
                onClick={() => removeFromCompare(slug)}
                className="text-[#8D95A0] hover:text-white cursor-pointer ml-0.5"
                aria-label={`Remove ${slug} from comparison`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="text-[#8D95A0] hover:text-rose-400 p-1 sm:hidden cursor-pointer"
          title="Clear all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={clearCompare}
          className="hidden sm:block text-xs font-semibold text-[#8D95A0] hover:text-white transition-colors px-2 py-1.5 cursor-pointer"
        >
          Clear
        </button>

        <Link
          href={`/compare?slugs=${compareSlugs.join(",")}`}
          className="w-full sm:w-auto py-2 px-4 rounded-xl bg-[#087443] hover:bg-[#065B34] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-premium-xs cursor-pointer active:scale-[0.98]"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
