"use client";

import React from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp } from "lucide-react";

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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6C28D9] flex items-center justify-center border border-purple-100">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-950 tracking-tight">
              Investment Compounding Insight
            </h4>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">
              1Fi Wealth Preservation
            </span>
          </div>
        </div>

        <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          ~{Math.round(MF_ANNUAL_CAGR * 100)}% CAGR
        </span>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">
        Instead of burning liquid cash or paying high interest, your mutual funds remain invested in your folio and keep compounding throughout your {selectedTenureMonths}-month tenure.
      </p>

      {/* 2-Box Metric Visualizer */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">
            Pledge Collateral ({DEFAULT_MIN_PLEDGE_MULTIPLIER}x)
          </span>
          <span className="text-base sm:text-lg font-semibold text-gray-950 block mt-0.5 tracking-tight">
            {formatINR(pledge)}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
            Units stay in your folio
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">
            Est. Compounding Gain
          </span>
          <span className="text-base sm:text-lg font-semibold text-[#6C28D9] block mt-0.5 tracking-tight">
            +{formatINR(totalWealthGained)}
          </span>
          <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
            Over {selectedTenureMonths} months
          </span>
        </div>
      </div>

      {/* Visual Compounding Progress Track */}
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-gray-700">
          <span>Pledged: {formatINR(pledge)}</span>
          <span className="text-emerald-700 font-semibold">
            Grows to {formatINR(projectedFutureMfValue)}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-[#6C28D9] rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
}

