"use strict";
"use client";

import React from "react";
import Link from "next/link";
import { ProductListItemDto } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import { ArrowRight, Heart, Scale, Check } from "lucide-react";
import { useWishlist, useCompare } from "@/context/WishlistCompareContext";
import clsx from "clsx";

interface ProductCardProps {
  product: ProductListItemDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const isWishlisted = isInWishlist(product.slug);
  const isCompared = isInCompare(product.slug);

  return (
    <div className="group relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--brand-primary)]/40 p-4 sm:p-5 shadow-premium-xs hover:shadow-premium-md transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 focus-glow-card">
      {/* Top Meta: Category, Badge & Action Icons */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--bg-surface-subtle)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
            {product.categoryName}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2 py-0.5 rounded border border-[var(--brand-primary)]/20">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          className="p-1.5 rounded-full hover:bg-[var(--bg-surface-subtle)] transition-colors text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={clsx(
              "w-4 h-4 transition-all duration-200",
              isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : "text-[var(--text-muted)]"
            )}
          />
        </button>
      </div>

      {/* Product Image Stage with Compare Overlay & Floor Shadow */}
      <div className="relative block my-3">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative w-full aspect-square rounded-xl bg-[var(--bg-surface-subtle)] p-4 flex items-center justify-center overflow-hidden border border-[var(--border-subtle)]/60 group/img">
            {/* Ambient Product Floor Glow */}
            <div className="product-floor-shadow absolute -bottom-4 w-3/4 h-8 bg-[var(--brand-primary)]/15 rounded-full blur-md opacity-70 group-hover/img:opacity-100 transition-opacity pointer-events-none" />
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.defaultVariant.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain max-h-[190px] transition-transform duration-300 group-hover:scale-105 relative z-10"
            />
          </div>
        </Link>

        {/* Compare Checkbox Trigger */}
        <button
          type="button"
          onClick={() => toggleCompare(product.slug)}
          className={clsx(
            "absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-all shadow-premium-xs cursor-pointer border z-20",
            isCompared
              ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
              : "bg-[var(--bg-surface)]/95 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)]"
          )}
          aria-pressed={isCompared}
        >
          {isCompared ? (
            <Check className="w-3 h-3 stroke-[3]" />
          ) : (
            <Scale className="w-3 h-3 text-[var(--text-secondary)]" />
          )}
          <span>{isCompared ? "Comparing" : "Compare"}</span>
        </button>
      </div>

      {/* Product Title & Brand */}
      <div className="mt-1 space-y-1 flex-1">
        <div className="text-xs text-[var(--text-secondary)] font-medium">
          {product.brand} • {product.variantsCount} Finishes
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Pricing & EMI Highlight */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[var(--text-primary)] tracking-tight">
              {formatINR(product.startingPrice)}
            </span>
            {product.startingMrp > product.startingPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through font-normal">
                {formatINR(product.startingMrp)}
              </span>
            )}
          </div>

          {product.startingMrp > product.startingPrice && (
            <span className="text-[11px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-1.5 py-0.5 rounded border border-[var(--brand-primary)]/20">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* 1Fi EMI Row & Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <span className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider block">
              Mutual Fund EMI
            </span>
            <div className="text-xs font-bold text-[var(--brand-primary)]">
              from {formatINR(product.minMonthlyEmi)}/mo
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="py-1.5 px-3.5 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1 group/btn shadow-premium-xs active:scale-[0.98]"
          >
            <span>Configure</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
