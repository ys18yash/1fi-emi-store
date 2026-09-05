"use strict";
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Heart, Scale } from "lucide-react";
import { useWishlist, useCompare } from "@/context/WishlistCompareContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-premium-xs py-2.5"
          : "bg-[var(--bg-page)]/95 backdrop-blur-sm border-b border-transparent py-3.5"
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <BrandLogo />

            {/* Protocol Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
              <span>0% LAMF ENGINE</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
            <Link
              href="/#catalog"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50 transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50 transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50 transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50 transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Right Action Area: Wishlist, Compare, ThemeToggle & CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Compare Link */}
            <Link
              href="/compare"
              className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/60 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Compare selected devices"
            >
              <Scale className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="hidden md:inline">Compare</span>
              {compareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/60 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="View wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-[var(--text-secondary)]"
                }`}
              />
              <span className="hidden md:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Catalog CTA */}
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] shadow-premium-xs transition-all duration-200 group active:scale-[0.98]"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Action Icons & Menu Toggle */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <ThemeToggle />

            <Link
              href="/wishlist"
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/60 relative"
              aria-label="View wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-[var(--text-secondary)]"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/compare"
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/60 relative"
              aria-label="View comparison"
            >
              <Scale className="w-4 h-4 text-[var(--text-secondary)]" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--brand-primary)] text-white text-[9px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/60 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-[var(--text-primary)]">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {wishlistCount} items
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-between"
            >
              <span>Device Comparison</span>
              {compareCount > 0 && (
                <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2 py-0.5 rounded-full border border-[var(--brand-primary)]/20">
                  {compareCount} items
                </span>
              )}
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] hover:text-[var(--brand-primary)] transition-colors"
            >
              FAQs
            </Link>
          </nav>

          <div className="pt-2">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-premium-xs transition-all"
            >
              <span>Browse Flagship Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
