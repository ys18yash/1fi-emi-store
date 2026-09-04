"use client";

import React, { useState } from "react";
import { VariantImageDto, ProductVariantDto } from "@/types/product";
import clsx from "clsx";

interface ProductGalleryProps {
  images: VariantImageDto[];
  productName: string;
  badge?: string | null;
  storage?: string | null;
  colorName: string;
  colorHex: string;
  variants?: ProductVariantDto[];
  selectedVariantId?: string;
  onSelectVariant?: (variant: ProductVariantDto) => void;
}

export function ProductGallery({
  images,
  productName,
  badge,
  storage,
  colorName,
  colorHex,
  variants = [],
  selectedVariantId,
  onSelectVariant,
}: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = images[activeImageIndex] || images[0] || {
    url: "/images/products/iphone17pro-desert.svg",
    altText: productName,
  };

  // Extract unique colors for current storage tier
  const availableColorVariants = variants.filter(
    (v) => !storage || v.storage === storage
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
      {/* Top Meta: Badge, Name, Storage Tier */}
      <div className="text-left space-y-1">
        {badge && (
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
          {productName}
        </h1>
        {storage && (
          <p className="text-sm font-normal text-gray-500">
            {storage}
          </p>
        )}
      </div>

      {/* Main Product Image Stage */}
      <div className="relative w-full aspect-square rounded-xl bg-gray-50 border border-gray-100 p-6 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage.url}
          alt={activeImage.altText || `${productName} in ${colorName}`}
          className="w-full h-full object-contain max-h-[320px] transition-transform duration-200 hover:scale-102"
        />
      </div>

      {/* Bottom: Available in X finishes + Color Dots */}
      <div className="text-center pt-2 space-y-2">
        <span className="text-xs font-normal text-gray-500">
          Available in {availableColorVariants.length || variants.length} finishes
        </span>

        <div className="flex items-center justify-center gap-2">
          {(availableColorVariants.length > 0 ? availableColorVariants : variants).map((v) => {
            const isSelected = selectedVariantId === v.id || v.colorName === colorName;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant && onSelectVariant(v)}
                title={v.colorName}
                aria-label={`Select ${v.colorName}`}
                className={clsx(
                  "w-5 h-5 rounded-full border transition-all duration-150 relative",
                  isSelected
                    ? "ring-2 ring-[#6C28D9] ring-offset-2 border-transparent"
                    : "border-gray-300 hover:scale-110"
                )}
                style={{ backgroundColor: v.colorHex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

