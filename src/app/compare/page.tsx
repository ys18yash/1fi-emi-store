"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCompare } from "@/context/WishlistCompareContext";
import { ProductDetailDto, ProductListItemDto } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import {
  Scale,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Loader2,
  Check,
  Trash2,
  Sparkles,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const { compareSlugs, removeFromCompare, clearCompare, toggleCompare, maxCount } = useCompare();

  const [products, setProducts] = useState<ProductDetailDto[]>([]);
  const [allCatalog, setAllCatalog] = useState<ProductListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Slugs to compare: Prefer query param if present, else fallback to context
  const activeSlugs = React.useMemo(() => {
    const fromUrl = searchParams.get("slugs");
    if (fromUrl) {
      return fromUrl.split(",").map((s) => s.trim()).filter(Boolean).slice(0, maxCount);
    }
    return compareSlugs;
  }, [searchParams, compareSlugs, maxCount]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        let compareData: ProductDetailDto[] = [];
        let catalogData: ProductListItemDto[] = [];

        try {
          const [compareRes, catalogRes] = await Promise.all([
            fetch(`/api/products/compare?slugs=${activeSlugs.join(",")}`),
            fetch("/api/products"),
          ]);
          if (compareRes.ok) {
            const compareJson = await compareRes.json();
            if (compareJson.success && Array.isArray(compareJson.data)) {
              compareData = compareJson.data;
            }
          }
          if (catalogRes.ok) {
            const catalogJson = await catalogRes.json();
            if (catalogJson.success && Array.isArray(catalogJson.data)) {
              catalogData = catalogJson.data;
            }
          }
        } catch {
          // Fall back to static JSON
        }

        if (catalogData.length === 0) {
          const res = await fetch("/data/products.json");
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              catalogData = json.data;
            }
          }
        }

        if (compareData.length === 0 && activeSlugs.length > 0) {
          // Try loading from static catalog
          try {
            const staticCatalogModule = await import("@/lib/static-catalog.json");
            const staticDetails = staticCatalogModule.productDetails as Record<string, ProductDetailDto>;
            compareData = activeSlugs
              .map((slug) => staticDetails[slug])
              .filter(Boolean);
          } catch {
            // Ignore
          }
        }

        setProducts(compareData);
        setAllCatalog(catalogData);
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [activeSlugs]);

  // Spec extractor helper
  const getSpecValue = (product: ProductDetailDto, searchKeywords: RegExp): string => {
    const found = product.specifications.find((s) => searchKeywords.test(s.name));
    return found ? found.value : "—";
  };

  return (
    <main className="flex-1 site-container py-8 sm:py-12 w-full space-y-8">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        {products.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {/* Page Hero */}
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Device Comparison Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal">
            Side-by-side technical and financial breakdown of up to 3 flagship devices
          </p>
        </div>

        <div className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-4 py-2 rounded-full self-start sm:self-auto border border-[var(--brand-primary)]/20">
          {products.length} of {maxCount} Devices Selected
        </div>
      </div>

      {/* Quick Add Available Products (if under max count) */}
      {products.length < maxCount && allCatalog.length > 0 && (
        <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-5 sm:p-6 shadow-xs space-y-3">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
            + Add a device to compare
          </span>
          <div className="flex flex-wrap gap-2.5">
            {allCatalog
              .filter((catItem) => !products.some((p) => p.slug === catItem.slug))
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCompare(item.slug)}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] text-xs font-bold text-[var(--text-primary)] hover:text-[var(--brand-primary)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--brand-primary-subtle)] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                  <span className="text-[var(--text-secondary)] font-normal">
                    ({formatINR(item.startingPrice)})
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {isLoading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            Loading device comparison specs...
          </span>
        </div>
      ) : products.length > 0 ? (
        <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-xs overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            {/* Table Header / Products Overview Row */}
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
                <th className="p-4 sm:p-6 w-1/4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider align-top">
                  Device Overview
                </th>
                {products.map((product) => {
                  const defaultVariant =
                    product.variants.find((v) => v.isDefault) || product.variants[0];
                  const primaryImage =
                    defaultVariant?.images.find((img) => img.isPrimary)?.url ||
                    defaultVariant?.images[0]?.url ||
                    "/images/products/iphone17pro-desert.svg";

                  const startingPrice = Math.min(...product.variants.map((v) => v.price));
                  const startingMrp =
                    product.variants.find((v) => v.price === startingPrice)?.mrp ?? startingPrice;
                  const discount = Math.round(
                    ((startingMrp - startingPrice) / startingMrp) * 100
                  );

                  return (
                    <th
                      key={product.id}
                      className="p-4 sm:p-6 w-1/4 align-top border-l border-[var(--border-subtle)] relative group"
                    >
                      {/* Remove from compare button */}
                      <button
                        type="button"
                        onClick={() => removeFromCompare(product.slug)}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        aria-label={`Remove ${product.name} from comparison`}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        {/* Image */}
                        <div className="w-28 h-28 mx-auto p-2 bg-[var(--bg-surface-subtle)] rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Title & Brand */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-wider block">
                            {product.brand}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] line-clamp-1">
                            {product.name}
                          </h3>
                        </div>

                        {/* Price */}
                        <div className="text-center space-y-0.5">
                          <div className="text-lg font-black text-[var(--text-primary)]">
                            {formatINR(startingPrice)}
                          </div>
                          {startingMrp > startingPrice && (
                            <div className="text-xs text-[var(--text-secondary)] line-through">
                              {formatINR(startingMrp)} ({discount}% off)
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <div className="pt-1">
                          <Link
                            href={`/products/${product.slug}`}
                            className="w-full py-2.5 px-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>Configure Plan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </th>
                  );
                })}

                {/* Empty Slot Placeholder if < 3 */}
                {Array.from({ length: maxCount - products.length }).map((_, idx) => (
                  <th
                    key={idx}
                    className="p-6 w-1/4 align-middle text-center border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/40"
                  >
                    <div className="py-12 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center mx-auto">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-[var(--text-secondary)] font-medium block">
                        Add Device Slot
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body / Specification Categories */}
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs sm:text-sm">
              {/* SECTION 1: FINANCING & EMI */}
              <tr className="bg-[var(--brand-primary-subtle)] font-bold text-[var(--brand-primary)]">
                <td colSpan={maxCount + 1} className="p-3.5 px-4 sm:px-6 uppercase tracking-wider text-xs">
                  Mutual Fund EMI & Financing
                </td>
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Lowest Monthly EMI
                </td>
                {products.map((p) => {
                  const defaultVariant = p.variants.find((v) => v.isDefault) || p.variants[0];
                  const minEmi = defaultVariant?.emiPlans.length
                    ? Math.min(...defaultVariant.emiPlans.map((pl) => pl.monthlyEmi))
                    : 0;
                  return (
                    <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-black text-[var(--brand-primary)]">
                      {minEmi > 0 ? `${formatINR(minEmi)}/mo` : "—"}
                    </td>
                  );
                })}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  0% No-Cost EMI Available
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-bold text-[var(--brand-primary)] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[var(--brand-primary)] stroke-[3]" />
                    <span>3, 6, 12, 24 Months</span>
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Cashback Reward
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-bold text-[var(--text-primary)]">
                    ₹7,500 Instant Cashback
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              {/* SECTION 2: HARDWARE & SPECS */}
              <tr className="bg-[var(--bg-surface-subtle)] font-bold text-[var(--text-primary)]">
                <td colSpan={maxCount + 1} className="p-3.5 px-4 sm:px-6 uppercase tracking-wider text-xs">
                  Technical Specifications
                </td>
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Storage Tiers
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {Array.from(new Set(p.variants.map((v) => v.storage || v.variantName))).join(", ")}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Display
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /display/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Processor
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /processor|chip/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  RAM Memory
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /ram/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Camera System
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /rear camera|camera/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Battery & Power
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /battery/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Operating System
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /operating system|os/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>

              <tr>
                <td className="p-4 px-4 sm:px-6 font-semibold text-[var(--text-secondary)]">
                  Warranty
                </td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-l border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                    {getSpecValue(p, /warranty/i)}
                  </td>
                ))}
                {Array.from({ length: maxCount - products.length }).map((_, i) => (
                  <td key={i} className="border-l border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]/30" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-12 sm:p-16 text-center space-y-5 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] flex items-center justify-center mx-auto border border-[var(--brand-primary)]/20">
            <Scale className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              No devices selected for comparison
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
              Select up to 3 flagship models from the catalog to compare hardware specifications, prices, and 0% mutual fund EMI options.
            </p>
          </div>
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>Explore All Devices</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />
      <Suspense
        fallback={
          <div className="py-32 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Initializing device comparison...
            </span>
          </div>
        }
      >
        <CompareContent />
      </Suspense>
      <Footer />
    </div>
  );
}

