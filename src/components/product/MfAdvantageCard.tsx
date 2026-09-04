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
    <div className="rounded-3xl border border-[#1F2E27] bg-[#101A17] text-white p-5 sm:p-6 shadow-premium-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#087443]/30 text-[#B7F34A] flex items-center justify-center border border-[#087443]/40 shadow-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Wealth Compounding Advantage
            </h4>
            <span className="text-[10px] text-[#8D95A0] font-semibold uppercase tracking-wider block">
              1Fi Portfolio Preservation
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-[#B7F34A] bg-[#087443]/30 px-2.5 py-0.5 rounded-full border border-[#087443]/40">
          ~{Math.round(MF_ANNUAL_CAGR * 100)}% CAGR
        </span>
      </div>

      <p className="text-xs text-[#8D95A0] leading-relaxed">
        Instead of burning liquid capital, your mutual funds remain 100% invested in your folio and continue compounding throughout your {selectedTenureMonths}-month tenure.
      </p>

      {/* 2-Box Metric Visualizer */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-2xl bg-[#172420] border border-[#1F2E27]">
          <span className="text-[10px] text-[#8D95A0] font-bold uppercase tracking-wider block">
            Pledge Collateral (1.5x)
          </span>
          <span className="text-base sm:text-lg font-black text-white block mt-0.5 tracking-tight">
            {formatINR(pledge)}
          </span>
          <span className="text-[10px] text-[#C4F36A] font-semibold block mt-0.5">
            Units stay in your name
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#172420] border border-[#087443]/40">
          <span className="text-[10px] text-[#C4F36A] font-bold uppercase tracking-wider block">
            Est. Compounded Gain
          </span>
          <span className="text-base sm:text-lg font-black text-[#B7F34A] block mt-0.5 tracking-tight">
            +{formatINR(totalWealthGained)}
          </span>
          <span className="text-[10px] text-[#8D95A0] font-semibold block mt-0.5">
            Over {selectedTenureMonths} months
          </span>
        </div>
      </div>

      {/* Visual Compounding Progress Track */}
      <div className="p-3.5 rounded-2xl bg-[#172420] border border-[#1F2E27] space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[#8D95A0]">Pledged: {formatINR(pledge)}</span>
          <span className="text-[#B7F34A] font-bold">
            Grows to {formatINR(projectedFutureMfValue)}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#101A17] overflow-hidden">
          <div className="h-full bg-[#087443] rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
}
