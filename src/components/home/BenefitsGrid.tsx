"use strict";

import React from "react";
import { TrendingUp, Percent, ShieldCheck, Clock, RefreshCw, Sparkles } from "lucide-react";

export function BenefitsGrid() {
  return (
    <section
      id="benefits"
      className="py-20 lg:py-24 bg-[var(--bg-page)] dark:bg-[#0C1412] text-[var(--text-primary)] dark:text-white scroll-mt-16 relative overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Fintech Technical Grid and Glow Overlay */}
      <div className="absolute inset-0 bg-grid-hero opacity-25 dark:opacity-15 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--brand-primary)]/8 dark:from-[#B7F34A]/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] border border-[var(--brand-primary)]/25 dark:border-[#B7F34A]/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
            <span>The 1Fi Wealth Compounding Model</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] dark:text-white tracking-tight leading-tight">
            Buy the device. <br />
            <span className="text-[var(--brand-primary)] dark:text-[#B7F34A]">Don&apos;t stop your wealth.</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xl mx-auto leading-relaxed">
            Comparing the smart collateralized purchasing model against breaking your hard-earned investments.
          </p>
        </div>

        {/* 2-Column Asymmetric Wealth Compounding Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Wealth Compounding Comparison Story Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] p-7 sm:p-8 shadow-premium-md dark:shadow-premium-lg flex flex-col justify-between relative overflow-hidden border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/30 transition-all duration-200">
            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary-subtle)] dark:bg-[#101A17] text-xs font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#1E2D27]">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
                <span>Compounding Case Study</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] dark:text-white tracking-tight leading-snug">
                Liquidating Mutual Funds vs 1Fi LAMF Pledge
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                When you redeem a ₹1.3L mutual fund investment to buy a smartphone, you trigger capital gains tax and lose compounding. Pledging units lets your ₹1.3L continue compounding to over <strong className="text-[var(--text-primary)] dark:text-white font-semibold">₹1,75,000</strong> in 3 years!
              </p>

              {/* Stat Comparison Metric Boxes */}
              <div className="pt-2 space-y-2.5 text-xs">
                {/* Traditional Liquidation */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-[#1C1416] border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-rose-700/80 dark:text-rose-300/80 font-medium block text-[11px]">Traditional Liquidation</span>
                    <span className="text-rose-900 dark:text-rose-400 font-bold text-xs sm:text-sm">Redeem ₹1,30,000 Portfolio</span>
                  </div>
                  <span className="text-rose-700 dark:text-rose-400 font-bold text-right text-xs bg-rose-100/90 dark:bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-200/60 dark:border-transparent shrink-0">
                    -₹45,000 Lost Gains
                  </span>
                </div>

                {/* 1Fi LAMF Compounding */}
                <div className="p-4 rounded-2xl bg-[var(--brand-primary-subtle)]/60 dark:bg-[#101A17] border border-[var(--brand-primary)]/35 dark:border-[#10B981]/50 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[var(--brand-primary)] dark:text-[#B7F34A] font-medium block text-[11px]">1Fi Mutual Fund EMI</span>
                    <span className="text-[var(--text-primary)] dark:text-white font-bold text-xs sm:text-sm">Pledge & Pay 0% EMI</span>
                  </div>
                  <span className="text-white dark:text-[#B7F34A] font-bold text-right text-xs bg-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20 px-2.5 py-1 rounded-lg border border-[var(--brand-primary)] dark:border-[var(--brand-primary)]/40 shrink-0 shadow-xs">
                    +100% Growth Intact
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-5 mt-6 border-t border-[var(--border-subtle)] dark:border-[#1E2D27] flex items-center justify-between text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2]">
              <span>Zero Foreclosure Penalty</span>
              <span className="font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">Instant Digital Lien Release</span>
            </div>
          </div>

          {/* Right Column: 4 Modular Benefit Tiles (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Tile 1: Zero Capital Gains Tax */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/50 shadow-premium-xs hover:shadow-premium-md transition-all duration-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
                  <Percent className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
                  Zero Capital Gains Tax
                </h4>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                  Since no mutual fund units are redeemed or sold, you trigger zero capital gains tax liabilities (LTCG / STCG).
                </p>
              </div>
            </div>

            {/* Tile 2: Backed by Collateral */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/50 shadow-premium-xs hover:shadow-premium-md transition-all duration-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
                  Collateral-Backed Credit
                </h4>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                  Your purchasing limit is determined by your verified portfolio value, eliminating traditional credit score friction.
                </p>
              </div>
            </div>

            {/* Tile 3: Flexible Tenures */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/50 shadow-premium-xs hover:shadow-premium-md transition-all duration-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
                  3 to 60-Month Tenures
                </h4>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                  Select short 0% No-Cost EMI tenures or extend up to 5 years for comfortable, low-ticket monthly installments.
                </p>
              </div>
            </div>

            {/* Tile 4: Automatic Digital Lien Release */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:border-[var(--brand-primary)]/40 dark:hover:border-[var(--brand-primary)]/50 shadow-premium-xs hover:shadow-premium-md transition-all duration-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] dark:text-white tracking-tight">
                  Automated Lien Release
                </h4>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                  Upon final EMI payment or loan pre-closure, the digital lien on your mutual fund units is unencumbered automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
