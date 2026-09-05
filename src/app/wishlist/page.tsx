"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useWishlist } from "@/context/WishlistCompareContext";
import { ProductListItemDto } from "@/types/product";
import { Heart, ArrowLeft, ArrowRight, Loader2, Sparkles, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { wishlistSlugs, removeFromWishlist, count } = useWishlist();
  const [products, setProducts] = useState<ProductListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        setIsLoading(true);
        let data: ProductListItemDto[] = [];

        try {
          const res = await fetch("/api/products");
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              data = json.data;
            }
          }
        } catch {
          // Fall back to static JSON
        }

        if (data.length === 0) {
          const res = await fetch("/data/products.json");
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              data = json.data;
            }
          }
        }

        // Filter to only wishlisted products
        const filtered = data.filter((p: ProductListItemDto) =>
          wishlistSlugs.includes(p.slug)
        );
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWishlistProducts();
  }, [wishlistSlugs]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />

      <main className="flex-1 site-container py-8 sm:py-12 w-full space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                My Saved Wishlist
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal">
              Flagship electronics saved for instant zero-cost mutual fund backed EMI
            </p>
          </div>

          <div className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-4 py-2 rounded-full self-start sm:self-auto border border-[var(--brand-primary)]/20">
            {count} {count === 1 ? "Device" : "Devices"} Saved
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Loading your saved devices...
            </span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] p-12 sm:p-16 text-center space-y-5 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <Heart className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
                Explore our catalog of flagship smartphones and laptops and tap the heart icon to save your favorites.
              </p>
            </div>
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Devices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

