"use strict";
"use client";

import React from "react";
import { CatalogFacetsDto, CatalogFilterState } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";

interface ProductFilterSidebarProps {
  facets: CatalogFacetsDto | null;
  filters: CatalogFilterState;
  onFilterChange: (key: keyof CatalogFilterState, value: string | number | undefined) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export function ProductFilterSidebar({
  facets,
  filters,
  onFilterChange,
  onClearAll,
  activeFilterCount,
}: ProductFilterSidebarProps) {
  const minPriceBound = facets?.priceRange.min ?? 50000;
  const maxPriceBound = facets?.priceRange.max ?? 200000;

  const currentMaxPrice = filters.maxPrice ?? maxPriceBound;

  return (
    <div className="space-y-6">
      {/* Header & Reset Action */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] dark:border-[#1E2D27]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">Catalog Filters</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-[var(--brand-primary)] dark:text-[#B7F34A] hover:underline font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] dark:text-[#9DA7A2] block">
          Device Category
        </label>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onFilterChange("category", undefined)}
            className={clsx(
              "w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer",
              !filters.category || filters.category === "ALL"
                ? "bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/30 dark:border-[#B7F34A]/30"
                : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#192722] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] border border-transparent"
            )}
          >
            <span>All Categories</span>
          </button>

          {facets?.categories.map((cat) => {
            const isSelected = filters.category === cat.slug || filters.category === cat.name;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onFilterChange("category", isSelected ? undefined : cat.slug)}
                className={clsx(
                  "w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-colors cursor-pointer",
                  isSelected
                    ? "bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/30 dark:border-[#B7F34A]/30"
                    : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#192722] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] border border-transparent"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] text-[var(--text-muted)] font-normal">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)] dark:border-[#1E2D27]">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] dark:text-[#9DA7A2] block">
          Brand
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange("brand", undefined)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer",
              !filters.brand || filters.brand === "ALL"
                ? "bg-[var(--brand-primary)] text-white"
                : "bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--border-subtle)] dark:hover:bg-[#1F302A] border border-[var(--border-subtle)] dark:border-[#1E2D27]"
            )}
          >
            All Brands
          </button>

          {facets?.brands.map((b) => {
            const isSelected = filters.brand === b.name;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => onFilterChange("brand", isSelected ? undefined : b.name)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1",
                  isSelected
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--border-subtle)] dark:hover:bg-[#1F302A] border border-[var(--border-subtle)] dark:border-[#1E2D27]"
                )}
              >
                <span>{b.name}</span>
                <span className={clsx("text-[10px]", isSelected ? "text-[#B7F34A]" : "text-[var(--text-muted)]")}>
                  ({b.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Storage Filter */}
      {facets && facets.storages.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)] dark:border-[#1E2D27]">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] dark:text-[#9DA7A2] block">
            Storage Capacity
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {facets.storages.map((s) => {
              const isSelected = filters.storage === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onFilterChange("storage", isSelected ? undefined : s.value)}
                  className={clsx(
                    "py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer",
                    isSelected
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A]"
                      : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:border-[var(--brand-primary)]/40"
                  )}
                >
                  <span>{s.value}</span>
                  <span className="block text-[10px] text-[var(--text-muted)] font-normal">
                    {s.count} {s.count === 1 ? "variant" : "variants"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Price Range Filter */}
      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)] dark:border-[#1E2D27]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] dark:text-[#9DA7A2]">
            Maximum Budget
          </label>
          <span className="text-xs font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">
            {formatINR(currentMaxPrice)}
          </span>
        </div>

        <input
          type="range"
          min={minPriceBound}
          max={maxPriceBound}
          step={5000}
          value={currentMaxPrice}
          onChange={(e) => onFilterChange("maxPrice", Number(e.target.value))}
          className="w-full accent-[var(--brand-primary)] cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-semibold">
          <span>Min: {formatINR(minPriceBound)}</span>
          <span>Max: {formatINR(maxPriceBound)}</span>
        </div>

        {/* Quick Price Presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onFilterChange("maxPrice", 130000)}
            className={clsx(
              "py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-colors cursor-pointer",
              currentMaxPrice === 130000
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A]"
                : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--bg-surface-subtle)]"
            )}
          >
            ≤ ₹1.30 Lakh
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("maxPrice", 150000)}
            className={clsx(
              "py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-colors cursor-pointer",
              currentMaxPrice === 150000
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A]"
                : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--bg-surface-subtle)]"
            )}
          >
            ≤ ₹1.50 Lakh
          </button>
        </div>
      </div>
    </div>
  );
}
