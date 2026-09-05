"use strict";

import { fetchProductsFromApi } from "@/lib/api-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroVisualizer } from "@/components/home/HeroVisualizer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { HowItWorksTimeline } from "@/components/home/HowItWorksTimeline";
import { BenefitsGrid } from "@/components/home/BenefitsGrid";
import { FinancingExplainer } from "@/components/home/FinancingExplainer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { ArrowRight, ShieldCheck, Sparkles, Percent, Lock, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

export default async function HomePage() {
  // Load dynamic catalog data through the backend REST API
  const products = await fetchProductsFromApi();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/20 selection:text-[var(--brand-primary)] transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO SECTION — EXCLUSIVE TRANSPARENT TECHNICAL GRID OVERLAY       */}
        {/* ================================================================= */}
        <section className="relative pt-10 pb-12 lg:pt-16 lg:pb-16 overflow-hidden border-b border-[var(--border-subtle)]">
          {/* Transparent grid overlay - same continuous underlying background color */}
          <div className="absolute inset-0 bg-grid-hero pointer-events-none z-0" />
          <div className="absolute inset-0 grid-intersection-dots opacity-30 pointer-events-none z-0" />

          <div className="site-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Hero Typography (7 Cols) */}
              <div className="lg:col-span-7 min-w-0 space-y-5 text-left">
                {/* Technical Protocol Status Eyebrow */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--brand-primary-subtle)] border border-[var(--brand-primary)]/20 text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-ping" />
                  <span>1Fi PROTOCOL • MUTUAL FUND BACKED FINANCING</span>
                </div>

                {/* Primary Editorial Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.12]">
                  Your next device. <br />
                  <span className="text-[var(--brand-primary)]">Your investments</span> keep growing.
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg leading-relaxed font-normal">
                  Get flagship smartphones and workstations on flexible 0% EMI while your mutual fund portfolio remains invested and compounds.
                </p>

                {/* CTA Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="#catalog"
                    className="px-6 py-3.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-premium-sm hover:shadow-premium-md focus-glow-btn active:scale-[0.98]"
                  >
                    <span>Explore Devices</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#how-it-works"
                    className="px-5 py-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] font-semibold text-sm transition-colors border border-[var(--border-subtle)] shadow-premium-xs focus-glow-card"
                  >
                    See How It Works
                  </a>
                </div>

                {/* Small Technical System Badges */}
                <div className="pt-3 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-[var(--text-muted)] border-t border-[var(--border-subtle)]/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--brand-primary)]">✓</span>
                    <span>1.5× Equity Collateral</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--brand-primary)]">✓</span>
                    <span>Zero STCG / LTCG Tax</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--brand-primary)]">✓</span>
                    <span>CAMS & KFintech Digital Lien</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Hardware & Wealth Growth Stage (5 Cols) */}
              <div className="lg:col-span-5 min-w-0 w-full flex justify-center lg:justify-end">
                <HeroVisualizer />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURE STRIP — NO GRID, SAME CONTINUOUS PAGE BACKGROUND  */}
        {/* ========================================================= */}
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-page)] py-3.5 relative z-10">
          <div className="site-container">
            <div className="flex flex-wrap items-center justify-between gap-y-3 text-xs font-semibold text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[var(--brand-primary)]" />
                <span className="text-[var(--text-primary)]">0% No-Cost EMI</span>
              </div>
              <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
                <span className="text-[var(--text-primary)]">Mutual Fund Backed</span>
              </div>
              <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <span className="text-[var(--text-primary)]">Digital Lien via CAMS & KFintech</span>
              </div>
              <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>

              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--brand-primary)]" />
                <span className="text-[var(--text-primary)]">Secure Instant Approvals</span>
              </div>
              <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                <span className="text-[var(--text-primary)]">Flexible 3–60 Month Plans</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRODUCT CATALOG SECTION (`#catalog`) — 01 / STORE         */}
        {/* ========================================================= */}
        <section id="catalog" className="bg-[var(--bg-page)] py-16 lg:py-24 scroll-mt-16 relative">
          <div className="site-container relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                  <span>01 / STORE</span>
                  <span className="text-[var(--border-strong)]">───</span>
                  <span>FLAGSHIP HARDWARE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight mt-1">
                  Flagship Devices. Smarter Financing.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md">
                Choose a device, configure your finish, and select a 0% mutual fund EMI plan tailored to your investments.
              </p>
            </div>

            <Suspense fallback={<div className="h-96 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] animate-pulse" />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WEALTH ADVANTAGE SECTION (`#benefits`) — 02 / ADVANTAGE   */}
        {/* ========================================================= */}
        <BenefitsGrid />

        {/* ========================================================= */}
        {/* 3-STEP FINANCING EXPLAINER (`#financing`) — 03 / FINANCING */}
        {/* ========================================================= */}
        <FinancingExplainer />

        {/* ========================================================= */}
        {/* HOW IT WORKS TIMELINE (`#how-it-works`) — 04 / TIMELINE   */}
        {/* ========================================================= */}
        <HowItWorksTimeline />

        {/* ========================================================= */}
        {/* FAQ ACCORDION SECTION (`#faq`) — 05 / FAQ                 */}
        {/* ========================================================= */}
        <FaqAccordion />

        {/* ========================================================= */}
        {/* BOTTOM CONVERSION CTA BANNER                              */}
        {/* ========================================================= */}
        <section className="bg-[var(--bg-surface-subtle)] text-[var(--text-primary)] py-16 sm:py-20 border-t border-[var(--border-subtle)] relative overflow-hidden transition-colors">
          <div className="site-container text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] border border-[var(--brand-primary)]/30 text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to upgrade without breaking your portfolio?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] max-w-2xl mx-auto leading-tight">
              Power your next smartphone or laptop today.
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
              Explore our full range of flagship electronics with zero capital gains tax and transparent 0% mutual fund EMI.
            </p>

            <div className="pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-sm shadow-premium-md focus-glow-btn transition-all active:scale-[0.98]"
              >
                <span>Browse All Devices</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
