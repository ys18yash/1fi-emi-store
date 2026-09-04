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
    // Find matching variant with same color if possible, else first in tier
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
    <div className="space-y-6 pt-5 border-t border-gray-100">
      {/* 1. Storage Capacity Configurator (if applicable) */}
      {uniqueStorages.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-800">
            <span className="uppercase tracking-wider text-gray-400 text-[11px] font-semibold">
              Step 1: Choose Capacity
            </span>
            <span className="text-[#6C28D9] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 text-xs font-medium">
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
                    "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-colors",
                    isSelected
                      ? "border-[#6C28D9] bg-purple-50/70"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span
                    className={clsx(
                      "text-sm font-semibold",
                      isSelected ? "text-[#6C28D9]" : "text-gray-950"
                    )}
                  >
                    {storage}
                  </span>
                  {variantForStorage && (
                    <span className="text-[11px] text-gray-500 font-normal mt-0.5">
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
        <div className="flex items-center justify-between text-xs text-gray-800">
          <span className="uppercase tracking-wider text-gray-400 text-[11px] font-semibold">
            Step 2: Choose Finish
          </span>
          <span className="text-gray-900 font-medium">
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
                  "group flex items-center gap-2 py-2 px-3 rounded-xl border transition-colors",
                  isSelected
                    ? "border-[#6C28D9] bg-purple-50/70"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <span
                  className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0"
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
                    "text-xs font-semibold",
                    isSelected ? "text-[#6C28D9]" : "text-gray-700"
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

