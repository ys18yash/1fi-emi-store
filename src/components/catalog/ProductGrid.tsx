"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProductListItemDto, ApiResponse } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Search, X, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ProductGridProps {
  products: ProductListItemDto[];
}

export function ProductGrid({ products: initialProducts }: ProductGridProps) {
  const [productsList, setProductsList] = useState<ProductListItemDto[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Extract all categories dynamically from initial data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialProducts.map((p) => p.categoryName)));
    return ["ALL", ...cats];
  }, [initialProducts]);

  // Client-side dynamic API fetch when filters change
  useEffect(() => {
    let isCancelled = false;

    async function fetchFilteredProducts() {
      // If no active filter, show initial products
      if (selectedCategory === "ALL" && !searchQuery.trim()) {
        setProductsList(initialProducts);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "ALL") {
          const found = initialProducts.find((p) => p.categoryName === selectedCategory);
          if (found) {
            params.set("search", selectedCategory === "Smartphones" ? "Smartphones" : selectedCategory);
          }
        }
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("API request failed");
        const json: ApiResponse<ProductListItemDto[]> = await res.json();

        if (!isCancelled && json.success && json.data) {
          let filtered = json.data;
          if (selectedCategory !== "ALL") {
            filtered = filtered.filter((p) => p.categoryName === selectedCategory);
          }
          setProductsList(filtered);
        }
      } catch (err) {
        // Graceful fallback to client filtering
        if (!isCancelled) {
          const fallback = initialProducts.filter((p) => {
            const matchesCat =
              selectedCategory === "ALL" || p.categoryName === selectedCategory;
            const matchesSearch =
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCat && matchesSearch;
          });
          setProductsList(fallback);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [selectedCategory, searchQuery, initialProducts]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat
                  ? "bg-[#6C28D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
              )}
            >
              {cat === "ALL" ? "All Flagship Devices" : cat}
            </button>
          ))}
        </div>

        {/* Search Input Bar with Live API Indicator */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Apple, Samsung, Pixel..."
            className="w-full pl-10 pr-9 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6C28D9] focus:border-[#6C28D9] transition-colors"
          />
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-[#6C28D9] absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {productsList.length === 0 && !isLoading && (
        <div className="py-16 text-center rounded-2xl bg-white border border-dashed border-gray-300 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-gray-950">
            No products match &quot;{searchQuery}&quot;
          </h4>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Try searching for a different brand, device name, or clear active category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-lg bg-[#6C28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

