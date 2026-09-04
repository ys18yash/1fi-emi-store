"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#6C28D9] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <span className="tracking-tighter">1F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-gray-950 leading-tight">
                1<span className="text-[#6C28D9]">Fi</span>
                <span className="text-[10px] font-medium text-gray-500 ml-1.5 px-1.5 py-0.5 rounded bg-gray-100">
                  Store
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-gray-600">
            <Link
              href="/#catalog"
              className="px-3 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-100 transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-100 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              className="px-3 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-100 transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              className="px-3 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-100 transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              className="px-3 py-1.5 rounded-md hover:text-gray-950 hover:bg-gray-100 transition-colors"
            >
              FAQs
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#6C28D9] hover:bg-[#581C87] shadow-xs transition-colors group"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-950 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-gray-700">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#6C28D9] transition-colors"
            >
              Explore Devices
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#6C28D9] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#6C28D9] transition-colors"
            >
              Wealth Advantage
            </Link>
            <Link
              href="/#financing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#6C28D9] transition-colors"
            >
              Financing Model
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#6C28D9] transition-colors"
            >
              FAQs
            </Link>
          </nav>

          <div className="pt-2">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#6C28D9] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
