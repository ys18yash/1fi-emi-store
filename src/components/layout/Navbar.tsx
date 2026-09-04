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
          ? "bg-[var(--bg-page)]/90 dark:bg-[#0C1412]/90 backdrop-blur-md border-b border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs py-2.5"
          : "bg-[var(--bg-page)]/95 dark:bg-[#0C1412]/95 backdrop-blur-sm border-b border-transparent py-3.5"
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <BrandLogo />

            {/* Protocol Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-subtle)] dark:bg-[#16241F] border border-[var(--border-subtle)] dark:border-[#1C2B25] text-[10px] font-semibold text-[var(--text-secondary)] dark:text-[#9DA9A3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] dark:bg-[#B7F34A] animate-pulse" />
              <span>0% LAMF ENGINE</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] dark:text-[#9DA7A2]">
            <Link
              href="/#catalog"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/50 dark:hover:bg-[#192722] transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/50 dark:hover:bg-[#192722] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/50 dark:hover:bg-[#192722] transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/50 dark:hover:bg-[#192722] transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              className="px-3 py-2 rounded-lg hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/50 dark:hover:bg-[#192722] transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Right Action Area: Wishlist, Compare, ThemeToggle & CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Compare Link */}
            <Link
              href="/compare"
              className="relative p-2 rounded-lg text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/60 dark:hover:bg-[#192722] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Compare selected devices"
            >
              <Scale className="w-4 h-4 text-[var(--text-secondary)] dark:text-[#9DA7A2]" />
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
              className="relative p-2 rounded-lg text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/60 dark:hover:bg-[#192722] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="View wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-[var(--text-secondary)] dark:text-[#9DA7A2]"
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
              className="p-2 rounded-lg text-[var(--text-primary)] dark:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/60 dark:hover:bg-[#192722] relative"
              aria-label="View wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-[var(--text-secondary)] dark:text-[#9DA7A2]"
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
              className="p-2 rounded-lg text-[var(--text-primary)] dark:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/60 dark:hover:bg-[#192722] relative"
              aria-label="View comparison"
            >
              <Scale className="w-4 h-4 text-[var(--text-secondary)] dark:text-[#9DA7A2]" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--brand-primary)] text-white text-[9px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-primary)] dark:text-[#F2F5F3] hover:bg-[var(--border-subtle)]/60 dark:hover:bg-[#192722] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-page)] dark:bg-[#0C1412] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-[var(--text-primary)] dark:text-[#F2F5F3]">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-between"
            >
              <span>Saved Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                  {wishlistCount} items
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors flex items-center justify-between"
            >
              <span>Device Comparison</span>
              {compareCount > 0 && (
                <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded-full border border-[var(--brand-primary)]/20">
                  {compareCount} items
                </span>
              )}
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-surface)] dark:hover:bg-[#192722] hover:text-[var(--brand-primary)] transition-colors"
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
