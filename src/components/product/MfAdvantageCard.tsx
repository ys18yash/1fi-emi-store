"use strict";
"use client";

import React from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp, Sparkles } from "lucide-react";

interface MfAdvantageCardProps {
  price: number;
  selectedTenureMonths: number;
  requiredMfPledge?: number;
  monthlyGrowthEstimated?: number;
}

export function MfAdvantageCard({
  price,
  selectedTenureMonths,
  requiredMfPledge,
}: MfAdvantageCardProps) {
  // Use passed database calculation or default multiplier constant
  const pledge =
    requiredMfPledge ?? Math.round(price * DEFAULT_MIN_PLEDGE_MULTIPLIER);
  const tenureYears = selectedTenureMonths / 12;
  const projectedFutureMfValue = Math.round(
    pledge * Math.pow(1 + MF_ANNUAL_CAGR, tenureYears)
  );
  const totalWealthGained = projectedFutureMfValue - pledge;

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] p-5 sm:p-6 shadow-premium-md space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] flex items-center justify-center border border-[var(--brand-primary)]/20 shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              Wealth Compounding Advantage
            </h4>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
              1Fi Portfolio Preservation
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] px-2.5 py-0.5 rounded-full border border-[var(--brand-primary)]/20">
          ~{Math.round(MF_ANNUAL_CAGR * 100)}% CAGR
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Instead of burning liquid capital, your mutual funds remain 100% invested in your folio and continue compounding throughout your {selectedTenureMonths}-month tenure.
      </p>

      {/* 2-Box Metric Visualizer */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider block">
            Pledge Collateral (1.5x)
          </span>
          <span className="text-base sm:text-lg font-black text-[var(--text-primary)] block mt-0.5 tracking-tight">
            {formatINR(pledge)}
          </span>
          <span className="text-[10px] text-[var(--brand-primary)] font-semibold block mt-0.5">
            Units stay in your name
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--brand-primary)]/30">
          <span className="text-[10px] text-[var(--brand-primary)] font-bold uppercase tracking-wider block">
            Est. Compounded Gain
          </span>
          <span className="text-base sm:text-lg font-black text-[var(--brand-primary)] block mt-0.5 tracking-tight">
            +{formatINR(totalWealthGained)}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-semibold block mt-0.5">
            Over {selectedTenureMonths} months
          </span>
        </div>
      </div>

      {/* Visual Compounding Progress Track */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[var(--text-secondary)]">Pledged: {formatINR(pledge)}</span>
          <span className="text-[var(--brand-primary)] font-bold">
            Grows to {formatINR(projectedFutureMfValue)}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
          <div className="h-full bg-[var(--brand-primary)] rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
}
