"use client";

import React from "react";
import { EmiPlanDto } from "@/types/product";
import { formatINR, formatInterest } from "@/lib/formatters";
import clsx from "clsx";

interface EmiPlanCardProps {
  plan: EmiPlanDto;
  isSelected: boolean;
  onSelect: (plan: EmiPlanDto) => void;
}

export function EmiPlanCard({ plan, isSelected, onSelect }: EmiPlanCardProps) {
  return (
    <div
      onClick={() => onSelect(plan)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(plan);
        }
      }}
      className={clsx(
        "cursor-pointer select-none rounded-lg p-3.5 sm:p-4 transition-colors border text-left",
        isSelected
          ? "border-[#6C28D9] bg-purple-50/50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
      )}
    >
      {/* Top Line: Monthly Amount x Tenure (Left) | Interest Rate (Right) */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-1.5 font-semibold text-gray-950 text-sm sm:text-base tracking-tight">
          <span>{formatINR(plan.monthlyEmi)}</span>
          <span className="font-normal text-gray-700 text-xs sm:text-sm">
            x {plan.tenureMonths} months
          </span>
        </div>

        <div className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
          {formatInterest(plan.annualInterestRate)}
        </div>
      </div>

      {/* Bottom Line: Additional Cashback in Green text */}
      {plan.cashbackAmount > 0 && (
        <div className="text-xs font-normal text-emerald-600 mt-1">
          {plan.cashbackDescription ||
            `Additional cashback of ${formatINR(plan.cashbackAmount)}`}
        </div>
      )}
    </div>
  );
}

