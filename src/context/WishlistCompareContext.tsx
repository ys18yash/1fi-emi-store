"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistCompareContextType {
  // Wishlist
  wishlistSlugs: string[];
  isInWishlist: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;

  // Comparison
  compareSlugs: string[];
  isInCompare: (slug: string) => boolean;
  toggleCompare: (slug: string) => boolean; // returns true if added, false if removed or reached max
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  maxCompareCount: number;
}

const WishlistCompareContext = createContext<WishlistCompareContextType | null>(null);

const WISHLIST_STORAGE_KEY = "1fi_wishlist_slugs";
const COMPARE_STORAGE_KEY = "1fi_compare_slugs";
const MAX_COMPARE = 3;

export function WishlistCompareProvider({ children }: { children: React.ReactNode }) {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlistSlugs(parsed);
      }

      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (savedCompare) {
        const parsed = JSON.parse(savedCompare);
        if (Array.isArray(parsed)) setCompareSlugs(parsed.slice(0, MAX_COMPARE));
      }
    } catch (e) {
      console.error("Failed to load wishlist/compare from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistSlugs));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage:", e);
    }
  }, [wishlistSlugs, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareSlugs));
    } catch (e) {
      console.error("Failed to save compare list to localStorage:", e);
    }
  }, [compareSlugs, isHydrated]);

  // Wishlist Helpers
  const isInWishlist = useCallback(
    (slug: string) => wishlistSlugs.includes(slug),
    [wishlistSlugs]
  );

  const toggleWishlist = useCallback((slug: string) => {
    setWishlistSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const removeFromWishlist = useCallback((slug: string) => {
    setWishlistSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  // Comparison Helpers
  const isInCompare = useCallback(
    (slug: string) => compareSlugs.includes(slug),
    [compareSlugs]
  );

  const toggleCompare = useCallback((slug: string): boolean => {
    let result = false;
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) {
        result = false;
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= MAX_COMPARE) {
        alert(`You can compare a maximum of ${MAX_COMPARE} devices at a time.`);
        result = false;
        return prev;
      }
      result = true;
      return [...prev, slug];
    });
    return result;
  }, []);

  const removeFromCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
  }, []);

  return (
    <WishlistCompareContext.Provider
      value={{
        wishlistSlugs,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        compareSlugs,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        maxCompareCount: MAX_COMPARE,
      }}
    >
      {children}
    </WishlistCompareContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistCompareContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistCompareProvider");
  }
  return {
    wishlistSlugs: context.wishlistSlugs,
    isInWishlist: context.isInWishlist,
    toggleWishlist: context.toggleWishlist,
    removeFromWishlist: context.removeFromWishlist,
    count: context.wishlistSlugs.length,
  };
}

export function useCompare() {
  const context = useContext(WishlistCompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a WishlistCompareProvider");
  }
  return {
    compareSlugs: context.compareSlugs,
    isInCompare: context.isInCompare,
    toggleCompare: context.toggleCompare,
    removeFromCompare: context.removeFromCompare,
    clearCompare: context.clearCompare,
    count: context.compareSlugs.length,
    maxCount: context.maxCompareCount,
  };
}
