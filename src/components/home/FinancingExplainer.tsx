"use strict";
"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp, Smartphone, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

export function FinancingExplainer() {
  const [devicePrice, setDevicePrice] = useState<number>(127400);
  const [tenure, setTenure] = useState<number>(12);

  const pledgeRequired = Math.round(devicePrice * DEFAULT_MIN_PLEDGE_MULTIPLIER);
  const monthlyEmi = Math.round(devicePrice / tenure);
  const projectedMfGain = Math.round(
    pledgeRequired * (Math.pow(1 + MF_ANNUAL_CAGR, tenure / 12) - 1)
  );

  return (
    <section id="financing" className="py-20 bg-[var(--bg-page)] dark:bg-[#0C1412] scroll-mt-16 relative">
      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] border border-[var(--brand-primary)]/30 dark:border-[#B7F34A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
            How Mutual Fund Financing Works
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xl mx-auto leading-relaxed">
            A frictionless digital process that allows you to buy electronics without selling your folio.
          </p>
        </div>

        {/* 3 Large Step Connected Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch mb-14">
          {/* Step 01 */}
          <div className="p-7 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs hover:shadow-premium-md transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[var(--brand-primary)]/30 dark:text-[#B7F34A]/30 tracking-tight font-mono">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
                Choose Your Device
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                Select your preferred flagship smartphone, laptop, or workstation. Choose custom finishes and storage capacity.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full brand manufacturer warranty</span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="p-7 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs hover:shadow-premium-md transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[var(--brand-primary)]/30 dark:text-[#B7F34A]/30 tracking-tight font-mono">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
                Pledge Mutual Funds
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                Complete a 2-minute digital lien marking via CAMS or KFintech. No units are redeemed, transferred, or sold.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Units stay in your name and folio</span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="p-7 rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs hover:shadow-premium-md transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[var(--brand-primary)]/30 dark:text-[#B7F34A]/30 tracking-tight font-mono">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
                Pay Monthly EMI
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                Enjoy your brand-new device while paying convenient 0% monthly installments. Your portfolio continues compounding in background.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Automatic lien release upon last EMI</span>
            </div>
          </div>
        </div>

        {/* Interactive LAMF Mathematical Simulation Box */}
        <div className="bg-[var(--bg-surface)] dark:bg-[#131E1A] rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--border-subtle)] dark:border-[#1E2D27]">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                Interactive Financing Simulator
              </h3>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2]">
                Slide to test custom device values and calculate your compounding benefit.
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] px-3 py-1 rounded-full border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 self-start sm:self-auto">
              1.5x Collateral Requirement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            {/* Box 1: Product Value */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] dark:text-[#9DA7A2]">
                  01. Device Value
                </span>
                <div className="text-2xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] mt-1 tracking-tight">
                  {formatINR(devicePrice)}
                </div>
              </div>
              <div className="pt-1">
                <input
                  type="range"
                  min="50000"
                  max="200000"
                  step="5000"
                  value={devicePrice}
                  onChange={(e) => setDevicePrice(Number(e.target.value))}
                  className="w-full accent-[var(--brand-primary)] cursor-pointer"
                />
              </div>
            </div>

            {/* Box 2: Portfolio Collateral */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[#B7F34A]">
                  02. Collateral (1.5x)
                </span>
                <div className="text-2xl font-black text-[var(--brand-primary)] dark:text-[#B7F34A] mt-1 tracking-tight">
                  {formatINR(pledgeRequired)}
                </div>
              </div>
              <div className="text-[11px] text-[var(--brand-primary)] dark:text-[#B7F34A] font-semibold bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] px-2.5 py-1 rounded-lg border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
                ✓ Stays in your folio
              </div>
            </div>

            {/* Box 3: Monthly EMI */}
            <div className="p-5 rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)] dark:text-[#F2F5F3]">
                  03. Monthly EMI ({tenure}m)
                </span>
                <div className="text-2xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] mt-1 tracking-tight">
                  {formatINR(monthlyEmi)}
                  <span className="text-xs font-normal text-[var(--text-secondary)] dark:text-[#9DA7A2] ml-1">/mo</span>
                </div>
              </div>
              <div className="flex gap-1 pt-1">
                {[3, 6, 12, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenure(m)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tenure === m
                        ? "bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--bg-surface)] dark:bg-[#131E1A] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--border-subtle)] dark:hover:bg-[#1F302A] border border-[var(--border-subtle)] dark:border-[#1E2D27]"
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            {/* Box 4: Wealth Compounding Gain */}
            <div className="p-5 rounded-2xl bg-[#101A17] dark:bg-[#0C1412] text-white border border-[#1F2E27] dark:border-[#1E2D27] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7F34A]">
                  04. Est. Portfolio Gain
                </span>
                <div className="text-2xl font-black text-[#B7F34A] mt-1 tracking-tight">
                  +{formatINR(projectedMfGain)}
                </div>
                <p className="text-[11px] text-[#8D95A0] dark:text-[#9DA7A2] mt-1">
                  At {Math.round(MF_ANNUAL_CAGR * 100)}% annual CAGR over {tenure} months.
                </p>
              </div>
              <div className="text-[11px] text-[#B7F34A] flex items-center gap-1.5 font-bold border-t border-[#1F2E27] dark:border-[#1E2D27] pt-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
                <span>100% Compounding Retained</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
