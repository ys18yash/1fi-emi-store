"use strict";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUp, Lock } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[var(--bg-surface-subtle)] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] transition-colors duration-200">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Wealth Positioning (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />

            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              India&apos;s modern investment-backed purchasing platform. Configure your favorite flagship devices with transparent 0% and low-interest EMI plans without redeeming your mutual funds.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[var(--brand-primary)] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>Digital Lien Marking via CAMS, KFintech & MFCentral</span>
            </div>
          </div>

          {/* Col 2: Flagship Devices (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Flagship Devices
            </h5>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/products/iphone-17-pro" className="hover:text-[var(--text-primary)] transition-colors">
                  Apple iPhone 17 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/samsung-galaxy-s25-ultra" className="hover:text-[var(--text-primary)] transition-colors">
                  Samsung Galaxy S25 Ultra
                </Link>
              </li>
              <li>
                <Link href="/products/google-pixel-10-pro" className="hover:text-[var(--text-primary)] transition-colors">
                  Google Pixel 10 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/macbook-pro-14-m4" className="hover:text-[var(--text-primary)] transition-colors">
                  Apple MacBook Pro 14 (M4)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Platform Links & Developer APIs (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Navigation & Architecture
            </h5>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/#catalog" className="hover:text-[var(--text-primary)] transition-colors">
                  Device Catalog & Filters
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
                  4-Step LAMF Process
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-[var(--text-primary)] transition-colors">
                  Wealth Compounding Model
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[var(--text-primary)] transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[var(--brand-primary)] hover:underline font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Management Portal</span>
                  <span className="text-[10px] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-1.5 py-0.5 rounded border border-[var(--brand-primary)]/20">/admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            © {new Date().getFullYear()} 1Fi Store. Built for smarter financing. All mutual fund trademarks belong to their respective AMCs.
          </p>

          <a
            href="#"
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
