"use strict";
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ProductListItemDto,
  CatalogFacetsDto,
  CatalogFilterState,
  ApiResponse,
} from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductFilterSidebar } from "./ProductFilterSidebar";
import { formatINR } from "@/lib/formatters";
import {
  Search,
  X,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  AlertCircle,
  Smartphone,
  Laptop,
  Layers,
} from "lucide-react";
import clsx from "clsx";

interface ProductGridProps {
  products: ProductListItemDto[];
}

export function ProductGrid({ products: initialProducts }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initialize filter state from URL query parameters
  const [filters, setFilters] = useState<CatalogFilterState>(() => ({
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    storage: searchParams.get("storage") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: (searchParams.get("sort") as CatalogFilterState["sort"]) ?? "recommended",
  }));

  const [productsList, setProductsList] = useState<ProductListItemDto[]>(initialProducts);
  const [facets, setFacets] = useState<CatalogFacetsDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Active filter count calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search && filters.search.trim()) count++;
    if (filters.category && filters.category !== "ALL") count++;
    if (filters.brand && filters.brand !== "ALL") count++;
    if (filters.storage && filters.storage !== "ALL") count++;
    if (filters.maxPrice !== undefined) count++;
    return count;
  }, [filters]);

  // 2. Synchronize URL query parameters with filter state
  const syncUrlParams = useCallback(
    (newFilters: CatalogFilterState) => {
      const params = new URLSearchParams();

      if (newFilters.search && newFilters.search.trim()) {
        params.set("search", newFilters.search.trim());
      }
      if (newFilters.category && newFilters.category !== "ALL") {
        params.set("category", newFilters.category);
      }
      if (newFilters.brand && newFilters.brand !== "ALL") {
        params.set("brand", newFilters.brand);
      }
      if (newFilters.storage && newFilters.storage !== "ALL") {
        params.set("storage", newFilters.storage);
      }
      if (newFilters.minPrice !== undefined) {
        params.set("minPrice", newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice !== undefined) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }
      if (newFilters.sort && newFilters.sort !== "recommended") {
        params.set("sort", newFilters.sort);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // 3. Fetch products and facets from backend API
  const fetchProducts = useCallback(
    async (currentFilters: CatalogFilterState) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const params = new URLSearchParams();
        if (currentFilters.search && currentFilters.search.trim()) {
          params.set("search", currentFilters.search.trim());
        }
        if (currentFilters.category && currentFilters.category !== "ALL") {
          params.set("category", currentFilters.category);
        }
        if (currentFilters.brand && currentFilters.brand !== "ALL") {
          params.set("brand", currentFilters.brand);
        }
        if (currentFilters.storage && currentFilters.storage !== "ALL") {
          params.set("storage", currentFilters.storage);
        }
        if (currentFilters.minPrice !== undefined) {
          params.set("minPrice", currentFilters.minPrice.toString());
        }
        if (currentFilters.maxPrice !== undefined) {
          params.set("maxPrice", currentFilters.maxPrice.toString());
        }
        if (currentFilters.sort) {
          params.set("sort", currentFilters.sort);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error(`API returned HTTP ${res.status}`);

        const json: ApiResponse<ProductListItemDto[]> = await res.json();
        if (json.success && json.data) {
          setProductsList(json.data);
          if (json.facets) {
            setFacets(json.facets);
          }
        } else {
          throw new Error(json.error || "Failed to load products");
        }
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : "Network error occurred";
        console.error("Error fetching catalog products:", errorText);
        setErrorMessage(errorText);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 4. Debounced fetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts(filters);
      syncUrlParams(filters);
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [filters, fetchProducts, syncUrlParams]);

  // Handler for individual filter change
  const handleFilterChange = (
    key: keyof CatalogFilterState,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler to reset all filters
  const handleClearAll = () => {
    setFilters({
      search: "",
      category: undefined,
      brand: undefined,
      storage: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "recommended",
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs & Quick Switcher (Requirement #9) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] dark:border-[#1E2D27] pb-4">
        <div className="flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] dark:bg-[#131E1A] p-1.5 rounded-xl border border-[var(--border-subtle)] dark:border-[#1E2D27]">
          <button
            type="button"
            onClick={() => handleFilterChange("category", undefined)}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              !filters.category || filters.category === "ALL"
                ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
                : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3]"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Devices</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("category", "Smartphones")}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              filters.category === "Smartphones"
                ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
                : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3]"
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphones</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("category", "Laptops & Computing")}
            className={clsx(
              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              filters.category === "Laptops & Computing"
                ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
                : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3]"
            )}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptops & Workstations</span>
          </button>
        </div>

        {/* Device Counter Badge */}
        <div className="text-xs font-semibold text-[var(--text-secondary)] dark:text-[#9DA7A2]">
          Showing <strong className="text-[var(--text-primary)] dark:text-[#F2F5F3]">{productsList.length}</strong> available devices
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-[var(--bg-surface-subtle)] dark:bg-[#131E1A] rounded-2xl border border-[var(--border-subtle)] dark:border-[#1E2D27] p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-premium-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-[var(--text-muted)] dark:text-[#6B7670] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search iPhone 17 Pro, Galaxy S25, M4, 256GB..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--bg-surface)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] text-xs sm:text-sm text-[var(--text-primary)] dark:text-[#F2F5F3] placeholder:text-[var(--text-muted)] dark:placeholder:text-[#6B7670] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-colors"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[var(--brand-primary)] dark:text-[#B7F34A] absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
          ) : filters.search ? (
            <button
              type="button"
              onClick={() => handleFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] text-xs font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] font-semibold hidden sm:inline-block">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={filters.sort ?? "recommended"}
                onChange={(e) =>
                  handleFilterChange(
                    "sort",
                    e.target.value as CatalogFilterState["sort"]
                  )
                }
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[var(--bg-surface)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] text-xs font-semibold text-[var(--text-primary)] dark:text-[#F2F5F3] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-colors cursor-pointer"
              >
                <option value="recommended">Featured & Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Releases</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2] font-semibold">Active filters:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 font-semibold">
              Search: &quot;{filters.search}&quot;
              <button
                type="button"
                onClick={() => handleFilterChange("search", "")}
                className="hover:text-[var(--brand-primary-hover)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category && filters.category !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 font-semibold">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => handleFilterChange("category", undefined)}
                className="hover:text-[var(--brand-primary-hover)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.brand && filters.brand !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 font-semibold">
              Brand: {filters.brand}
              <button
                type="button"
                onClick={() => handleFilterChange("brand", undefined)}
                className="hover:text-[var(--brand-primary-hover)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.storage && filters.storage !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 font-semibold">
              Storage: {filters.storage}
              <button
                type="button"
                onClick={() => handleFilterChange("storage", undefined)}
                className="hover:text-[var(--brand-primary-hover)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 font-semibold">
              Price ≤ {formatINR(filters.maxPrice)}
              <button
                type="button"
                onClick={() => handleFilterChange("maxPrice", undefined)}
                className="hover:text-[var(--brand-primary-hover)] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-[var(--brand-primary)] dark:text-[#B7F34A] hover:underline font-bold ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Catalog Layout (Sidebar Left + Grid Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 bg-[var(--bg-surface-subtle)] dark:bg-[#131E1A] rounded-2xl border border-[var(--border-subtle)] dark:border-[#1E2D27] p-5 sticky top-24 shadow-premium-xs">
          <ProductFilterSidebar
            facets={facets}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        {/* Product Grid Area (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Loading Skeleton Grid */}
          {isLoading && productsList.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#131E1A] p-5 space-y-4"
                >
                  <div className="aspect-square rounded-xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722]" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-[#1E2D27] rounded-md w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-[#1E2D27]/60 rounded-md w-1/2" />
                  </div>
                  <div className="h-8 bg-gray-100 dark:bg-[#1E2D27]/60 rounded-lg" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            /* Error State */
            <div className="py-16 text-center rounded-2xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-red-200 dark:border-red-900/40 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                Failed to Load Products
              </h4>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xs mx-auto leading-relaxed">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => fetchProducts(filters)}
                className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : productsList.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center rounded-2xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-dashed border-[var(--border-subtle)] dark:border-[#1E2D27] p-8 space-y-4 max-w-lg mx-auto shadow-premium-xs">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                No products match your criteria
              </h4>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xs mx-auto leading-relaxed">
                Try loosening your filters, adjusting the maximum price, or searching with broader keywords.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold transition-colors cursor-pointer shadow-premium-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Product Cards Grid (3 Columns) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#101A17]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[var(--bg-surface)] dark:bg-[#131E1A] text-[var(--text-primary)] dark:text-[#F2F5F3] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-[var(--border-subtle)] dark:border-[#1E2D27]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] dark:border-[#1E2D27] mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
                  <h3 className="text-base font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">Filter Catalog</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#192722] cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilterSidebar
                facets={facets}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
                activeFilterCount={activeFilterCount}
              />
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)] dark:border-[#1E2D27] mt-6">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs transition-colors cursor-pointer shadow-premium-xs"
              >
                Apply Filters ({productsList.length} results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
