"use strict";
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { VariantImageDto, ProductVariantDto } from "@/types/product";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Check,
} from "lucide-react";
import clsx from "clsx";

export interface ProductGalleryProps {
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

const FALLBACK_IMAGE_URL = "/images/products/iphone17pro-desert.svg";
const MAX_DESKTOP_THUMBNAILS = 5; // Visible slots on vertical rail (including +N tile if overflow)

export function ProductGallery({
  images = [],
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgLoadError, setImgLoadError] = useState<Record<number, boolean>>({});
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Touch swipe gesture refs for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter valid images or use fallback
  const validImages: VariantImageDto[] = images && images.length > 0 ? images : [
    {
      id: "fallback",
      url: FALLBACK_IMAGE_URL,
      altText: `${productName} in ${colorName}`,
      isPrimary: true,
      displayOrder: 1,
    },
  ];

  // Auto-reset active index when variant or images change
  useEffect(() => {
    setActiveImageIndex(0);
    setImgLoadError({});
    setIsImageTransitioning(false);
  }, [selectedVariantId, images]);

  // Safe active image retrieval
  const safeIndex = Math.min(Math.max(0, activeImageIndex), validImages.length - 1);
  const activeImage = validImages[safeIndex] || validImages[0];

  const handleSelectImage = useCallback((index: number) => {
    if (index === activeImageIndex) return;
    setIsImageTransitioning(true);
    setActiveImageIndex(index);
    setTimeout(() => setIsImageTransitioning(false), 200);
  }, [activeImageIndex]);

  const handlePrev = useCallback(() => {
    setIsImageTransitioning(true);
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
    setTimeout(() => setIsImageTransitioning(false), 200);
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setIsImageTransitioning(true);
    setActiveImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsImageTransitioning(false), 200);
  }, [validImages.length]);

  // Keyboard navigation for Lightbox & Main Gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, isLightboxOpen]);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diffX > minSwipeDistance) {
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Thumbnail rail calculations:
  // If total images > MAX_DESKTOP_THUMBNAILS, we show (MAX_DESKTOP_THUMBNAILS - 1) thumbnails and the last slot is "+N"
  const hasOverflow = validImages.length > MAX_DESKTOP_THUMBNAILS;
  const visibleThumbnailsCount = hasOverflow ? MAX_DESKTOP_THUMBNAILS - 1 : validImages.length;
  const overflowCount = hasOverflow ? validImages.length - visibleThumbnailsCount : 0;
  const visibleThumbnails = validImages.slice(0, visibleThumbnailsCount);
  const overflowFirstImage = hasOverflow ? validImages[visibleThumbnailsCount] : null;

  // Extract unique colors for current storage tier
  const availableColorVariants = variants.filter(
    (v) => !storage || v.storage === storage
  );

  return (
    <div className="bg-[var(--bg-surface)] dark:bg-[#131E1A] rounded-3xl border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-sm p-5 sm:p-7 flex flex-col justify-between space-y-6">
      {/* Top Meta: Badge, Name, Storage Tier */}
      <div className="text-left space-y-1.5">
        {badge && (
          <span className="text-[10px] font-bold text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] px-2.5 py-0.5 rounded uppercase tracking-wider inline-block border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
          {productName}
        </h1>
        {storage && (
          <p className="text-xs font-semibold text-[var(--text-secondary)] dark:text-[#9DA7A2]">
            {storage} • {colorName}
          </p>
        )}
      </div>

      {/* Main Gallery Container: Left Vertical Rail + Large Center Stage */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-5">
        {/* Desktop / Tablet Vertical Thumbnail Rail (Left) */}
        {validImages.length > 1 && (
          <div className="hidden md:flex flex-col gap-2.5 shrink-0 justify-start select-none">
            {visibleThumbnails.map((img, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => handleSelectImage(idx)}
                  className={clsx(
                    "relative w-14 h-14 lg:w-16 lg:h-16 rounded-xl p-1 bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border transition-all duration-200 shrink-0 cursor-pointer overflow-hidden group/thumb flex items-center justify-center",
                    isSelected
                      ? "border-[var(--brand-primary)] dark:border-[#B7F34A] ring-2 ring-[var(--brand-primary)]/25 dark:ring-[#B7F34A]/30 bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] scale-[1.02]"
                      : "border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/40 dark:hover:border-[#B7F34A]/40 opacity-75 hover:opacity-100 hover:scale-[1.03]"
                  )}
                  aria-label={`View image ${idx + 1} of ${validImages.length}: ${img.altText || productName}`}
                  aria-selected={isSelected}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgLoadError[idx] ? FALLBACK_IMAGE_URL : img.url}
                    alt={img.altText || `Thumbnail ${idx + 1}`}
                    onError={() => setImgLoadError((prev) => ({ ...prev, [idx]: true }))}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-200 group-hover/thumb:scale-105"
                  />
                </button>
              );
            })}

            {/* +N Additional Images Tile */}
            {hasOverflow && overflowFirstImage && (
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-xl p-1 bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/60 dark:hover:border-[#B7F34A]/60 transition-all duration-200 shrink-0 cursor-pointer overflow-hidden group/overflow flex items-center justify-center"
                aria-label={`View all ${validImages.length} images (+${overflowCount} more)`}
                title={`Click to view all ${validImages.length} images`}
              >
                {/* Background image preview with blur */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={overflowFirstImage.url}
                  alt="Additional product photos"
                  className="w-full h-full object-contain opacity-35 filter blur-[0.5px] scale-110 group-hover/overflow:scale-125 transition-transform duration-300"
                />

                {/* +N Overlay Badge */}
                <div className="absolute inset-0 bg-black/45 dark:bg-black/60 flex items-center justify-center text-white font-bold text-sm lg:text-base tracking-tight font-mono group-hover/overflow:bg-[var(--brand-primary)]/80 transition-colors">
                  +{overflowCount}
                </div>
              </button>
            )}
          </div>
        )}

        {/* Large Center Stage Product Image */}
        <div
          className="relative flex-1 min-w-0 aspect-square rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border border-[var(--border-subtle)]/60 dark:border-[#1E2D27] p-6 sm:p-8 flex items-center justify-center overflow-hidden group select-none cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={`Enlarge product image for ${productName}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsLightboxOpen(true);
            }
          }}
        >
          {/* Main Primary Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeImage.url + safeIndex}
            src={imgLoadError[safeIndex] ? FALLBACK_IMAGE_URL : activeImage.url}
            alt={activeImage.altText || `${productName} in ${colorName} - View ${safeIndex + 1}`}
            onError={() => setImgLoadError((prev) => ({ ...prev, [safeIndex]: true }))}
            className={clsx(
              "w-full h-full object-contain max-h-[340px] sm:max-h-[380px] transition-all duration-300 group-hover:scale-105",
              isImageTransitioning ? "opacity-70 scale-[0.98]" : "opacity-100 scale-100"
            )}
          />

          {/* Fullscreen Expand Badge Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-[var(--bg-surface)]/90 dark:bg-[#131E1A]/90 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] dark:text-[#F2F5F3] shadow-premium-xs border border-[var(--border-subtle)] dark:border-[#1E2D27] transition-all opacity-80 hover:opacity-100 cursor-pointer z-10"
            aria-label="Open fullscreen image preview"
          >
            <Maximize2 className="w-4 h-4 text-[var(--text-secondary)] dark:text-[#9DA7A2]" />
          </button>

          {/* Live Image Counter (e.g. 1 / 6) */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#101A17]/80 dark:bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold pointer-events-none font-mono z-10 border border-white/10">
              {safeIndex + 1} / {validImages.length}
            </div>
          )}

          {/* Navigation Arrows on Hover (Desktop & Tablet) */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--bg-surface)]/95 dark:bg-[#131E1A]/95 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] dark:text-[#F2F5F3] shadow-premium-sm border border-[var(--border-subtle)] dark:border-[#1E2D27] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer z-10 active:scale-95"
                aria-label="Previous product image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--bg-surface)]/95 dark:bg-[#131E1A]/95 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] dark:text-[#F2F5F3] shadow-premium-sm border border-[var(--border-subtle)] dark:border-[#1E2D27] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer z-10 active:scale-95"
                aria-label="Next product image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Thumbnail Scroller & Pagination Indicators */}
      {validImages.length > 1 && (
        <div className="flex md:hidden flex-col items-center gap-2.5 pt-1">
          {/* Horizontal Thumbnail Row for Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar justify-center">
            {validImages.map((img, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => handleSelectImage(idx)}
                  className={clsx(
                    "relative w-12 h-12 rounded-xl p-1 bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border transition-all shrink-0 cursor-pointer overflow-hidden",
                    isSelected
                      ? "border-[var(--brand-primary)] dark:border-[#B7F34A] ring-2 ring-[var(--brand-primary)]/20 bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)]"
                      : "border-[var(--border-subtle)] dark:border-[#1E2D27] opacity-60"
                  )}
                  aria-label={`View photo ${idx + 1}`}
                  aria-selected={isSelected}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgLoadError[idx] ? FALLBACK_IMAGE_URL : img.url}
                    alt={img.altText || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            {validImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => handleSelectImage(dotIdx)}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-200",
                  dotIdx === safeIndex
                    ? "bg-[var(--brand-primary)] dark:bg-[#B7F34A] w-4"
                    : "bg-[var(--border-subtle)] dark:bg-[#2A3E36] w-1.5 hover:bg-[var(--text-muted)]"
                )}
                aria-label={`Jump to photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom: Available in X finishes + Color Palette Dots */}
      <div className="text-center pt-3 space-y-2.5 border-t border-[var(--border-subtle)] dark:border-[#1E2D27]">
        <span className="text-xs font-semibold text-[var(--text-secondary)] dark:text-[#9DA7A2]">
          Available in {availableColorVariants.length || variants.length} finishes
        </span>

        <div className="flex items-center justify-center gap-2.5">
          {(availableColorVariants.length > 0 ? availableColorVariants : variants).map((v) => {
            const isSelected = selectedVariantId === v.id || v.colorName === colorName;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant && onSelectVariant(v)}
                title={v.colorName}
                aria-label={`Select finish: ${v.colorName}`}
                className={clsx(
                  "w-5 h-5 rounded-full border transition-all duration-200 relative flex items-center justify-center cursor-pointer",
                  isSelected
                    ? "ring-2 ring-[var(--brand-primary)] dark:ring-[#B7F34A] ring-offset-2 ring-offset-[var(--bg-surface)] dark:ring-offset-[#131E1A] border-transparent scale-110"
                    : "border-gray-300 dark:border-gray-600 hover:scale-110 opacity-85 hover:opacity-100"
                )}
                style={{ backgroundColor: v.colorHex }}
              >
                {isSelected && (
                  <Check
                    className={clsx(
                      "w-3 h-3 stroke-[3]",
                      v.colorHex.toLowerCase() === "#ffffff" ||
                        v.colorHex.toLowerCase() === "#eae7df" ||
                        v.colorHex.toLowerCase() === "#e3e4e5" ||
                        v.colorHex.toLowerCase() === "#e1e2e4"
                        ? "text-gray-950"
                        : "text-white"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Portaled to document.body) */}
      {mounted && isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-[#0B1210]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} Fullscreen Gallery`}
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Top Header */}
            <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full pt-2">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {productName}
                </h4>
                <p className="text-xs text-[#8D95A0] font-medium">
                  {activeImage.altText || `${colorName} (${safeIndex + 1} of ${validImages.length})`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Center Image Stage */}
            <div
              className="relative flex-1 flex items-center justify-center p-4 max-w-5xl mx-auto w-full my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgLoadError[safeIndex] ? FALLBACK_IMAGE_URL : activeImage.url}
                alt={activeImage.altText || `${productName} view ${safeIndex + 1}`}
                className="max-h-[70vh] max-w-[85vw] object-contain select-none transition-transform duration-300 shadow-2xl"
              />

              {/* Lightbox Prev / Next Controls */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-1 sm:left-4 p-3 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white transition-colors cursor-pointer active:scale-95"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-1 sm:right-4 p-3 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white transition-colors cursor-pointer active:scale-95"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails Grid */}
            {validImages.length > 1 && (
              <div
                className="flex items-center justify-center gap-2.5 max-w-2xl mx-auto w-full overflow-x-auto pb-2 no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {validImages.map((img, idx) => {
                  const isSelected = idx === safeIndex;
                  return (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => handleSelectImage(idx)}
                      className={clsx(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-1 bg-white/5 border transition-all shrink-0 cursor-pointer overflow-hidden flex items-center justify-center",
                        isSelected
                          ? "border-[#10B981] ring-2 ring-[#B7F34A] scale-105 bg-white/10"
                          : "border-white/20 hover:border-white/50 opacity-55 hover:opacity-100"
                      )}
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgLoadError[idx] ? FALLBACK_IMAGE_URL : img.url}
                        alt={img.altText || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
