"use strict";
"use client";

import React from "react";
import { ProductVariantDto } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import clsx from "clsx";
import { Check } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariantDto[];
  selectedVariant: ProductVariantDto;
  onSelectVariant: (variant: ProductVariantDto) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  // Extract unique storage capacities
  const uniqueStorages = Array.from(
    new Set(variants.map((v) => v.storage).filter(Boolean))
  ) as string[];

  // Extract available color variants for current selected storage tier
  const availableColorsForStorage = variants.filter(
    (v) => v.storage === selectedVariant.storage
  );

  const handleStorageChange = (storage: string) => {
    const matching =
      variants.find(
        (v) => v.storage === storage && v.colorName === selectedVariant.colorName
      ) || variants.find((v) => v.storage === storage);

    if (matching) {
      onSelectVariant(matching);
    }
  };

  const handleColorChange = (colorName: string) => {
    const matching = variants.find(
      (v) => v.storage === selectedVariant.storage && v.colorName === colorName
    );
    if (matching) {
      onSelectVariant(matching);
    }
  };

  return (
    <div className="space-y-6 pt-5 border-t border-[var(--border-subtle)]">
      {/* 1. Storage Capacity Configurator (if applicable) */}
      {uniqueStorages.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-primary)]">
            <span className="uppercase tracking-wider text-[var(--text-secondary)] text-[11px] font-bold">
              Choose Capacity
            </span>
            <span className="text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--brand-primary)]/20 text-xs font-bold">
              Selected: {selectedVariant.storage}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {uniqueStorages.map((storage) => {
              const variantForStorage = variants.find((v) => v.storage === storage);
              const isSelected = selectedVariant.storage === storage;

              return (
                <button
                  key={storage}
                  type="button"
                  onClick={() => handleStorageChange(storage)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer",
                    isSelected
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] shadow-premium-xs ring-1 ring-[var(--brand-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--bg-surface-subtle)]"
                  )}
                >
                  <span
                    className={clsx(
                      "text-sm font-bold",
                      isSelected ? "text-[var(--brand-primary)]" : "text-[var(--text-primary)]"
                    )}
                  >
                    {storage}
                  </span>
                  {variantForStorage && (
                    <span className="text-[11px] text-[var(--text-secondary)] font-normal mt-0.5">
                      {formatINR(variantForStorage.price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Color / Finish Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-[var(--text-primary)]">
          <span className="uppercase tracking-wider text-[var(--text-secondary)] text-[11px] font-bold">
            Choose Finish
          </span>
          <span className="text-[var(--text-primary)] font-semibold">
            {selectedVariant.colorName} ({availableColorsForStorage.length} available)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {availableColorsForStorage.map((variant) => {
            const isSelected = selectedVariant.id === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => handleColorChange(variant.colorName)}
                className={clsx(
                  "group flex items-center gap-2 py-2 px-3.5 rounded-xl border transition-all cursor-pointer",
                  isSelected
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] shadow-premium-xs ring-1 ring-[var(--brand-primary)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--bg-surface-subtle)]"
                )}
              >
                <span
                  className="w-4 h-4 rounded-full border border-[var(--border-subtle)] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: variant.colorHex }}
                >
                  {isSelected && (
                    <Check
                      className={clsx(
                        "w-2.5 h-2.5",
                        variant.colorHex.toLowerCase() === "#ffffff" ||
                          variant.colorHex.toLowerCase() === "#eae7df" ||
                          variant.colorHex.toLowerCase() === "#e3e4e5"
                          ? "text-gray-900"
                          : "text-white"
                      )}
                    />
                  )}
                </span>
                <span
                  className={clsx(
                    "text-xs font-bold",
                    isSelected ? "text-[var(--brand-primary)]" : "text-[var(--text-primary)]"
                  )}
                >
                  {variant.colorName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
