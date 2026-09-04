import React from "react";
import Link from "next/link";
import { ProductListItemDto } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: ProductListItemDto;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative rounded-2xl bg-white border border-gray-200 hover:border-gray-300 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between overflow-hidden">
      {/* Top Meta */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          {product.categoryName}
        </span>

        {product.badge && (
          <span className="text-[10px] font-semibold tracking-wide uppercase text-white bg-[#6C28D9] px-2.5 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Image Stage */}
      <Link href={`/products/${product.slug}`} className="block my-2">
        <div className="relative w-full aspect-square rounded-lg bg-gray-50/70 p-4 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.defaultVariant.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain max-h-[180px] transition-transform duration-200 group-hover:scale-103"
          />
        </div>
      </Link>

      {/* Product Title & Brand */}
      <div className="mt-2 space-y-1 flex-1">
        <div className="text-xs text-gray-500 font-medium">
          {product.brand} • {product.variantsCount} Finishes
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold text-gray-950 group-hover:text-[#6C28D9] transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Pricing & EMI Highlight */}
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-950 tracking-tight">
              {formatINR(product.startingPrice)}
            </span>
            {product.startingMrp > product.startingPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatINR(product.startingMrp)}
              </span>
            )}
          </div>

          {product.startingMrp > product.startingPrice && (
            <span className="text-xs font-medium text-emerald-600">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* 1Fi EMI Row & Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider block">
              Mutual Fund EMI
            </span>
            <div className="text-xs font-semibold text-[#6C28D9]">
              from {formatINR(product.minMonthlyEmi)}/mo
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="py-1.5 px-3 rounded-lg bg-[#6C28D9] hover:bg-[#581C87] text-white text-xs font-medium transition-colors flex items-center gap-1 group/btn"
          >
            <span>Configure</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
