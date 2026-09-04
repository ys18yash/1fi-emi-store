"use strict";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUp, Lock } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[#101A17] dark:bg-[#080E0C] text-[#8D95A0] dark:text-[#9DA7A2] border-t border-[#1F2E27] dark:border-[#1E2D27] transition-colors duration-200">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Wealth Positioning (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />

            <p className="text-xs text-[#8D95A0] dark:text-[#9DA7A2] max-w-sm leading-relaxed">
              India&apos;s modern investment-backed purchasing platform. Configure your favorite flagship devices with transparent 0% and low-interest EMI plans without redeeming your mutual funds.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#B7F34A] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Digital Lien Marking via CAMS, KFintech & MFCentral</span>
            </div>
          </div>

          {/* Col 2: Flagship Devices (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Flagship Devices
            </h5>
            <ul className="space-y-2.5 text-xs text-[#8D95A0] dark:text-[#9DA7A2]">
              <li>
                <Link href="/products/iphone-17-pro" className="hover:text-white transition-colors">
                  Apple iPhone 17 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/samsung-galaxy-s25-ultra" className="hover:text-white transition-colors">
                  Samsung Galaxy S25 Ultra
                </Link>
              </li>
              <li>
                <Link href="/products/google-pixel-10-pro" className="hover:text-white transition-colors">
                  Google Pixel 10 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/macbook-pro-14-m4" className="hover:text-white transition-colors">
                  Apple MacBook Pro 14 (M4)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Platform Links & Developer APIs (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation & Architecture
            </h5>
            <ul className="space-y-2.5 text-xs text-[#8D95A0] dark:text-[#9DA7A2]">
              <li>
                <Link href="/#catalog" className="hover:text-white transition-colors">
                  Device Catalog & Filters
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  4-Step LAMF Process
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-white transition-colors">
                  Wealth Compounding Model
                </Link>
              </li>
              <li>
                <Link href="/api/products" className="font-mono text-[var(--brand-primary)] dark:text-[#B7F34A] hover:text-white transition-colors">
                  GET /api/products
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#B7F34A] hover:underline font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Management Portal</span>
                  <span className="text-[10px] bg-[var(--brand-primary)]/40 text-[#B7F34A] px-1.5 py-0.2 rounded border border-[var(--brand-primary)]">/admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1F2E27] dark:border-[#1E2D27] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8D95A0] dark:text-[#9DA7A2]">
          <p>
            © {new Date().getFullYear()} 1Fi Store. Built for smarter financing. All mutual fund trademarks belong to their respective AMCs.
          </p>

          <a
            href="#"
            className="flex items-center gap-1.5 text-[#8D95A0] dark:text-[#9DA7A2] hover:text-white transition-colors font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
