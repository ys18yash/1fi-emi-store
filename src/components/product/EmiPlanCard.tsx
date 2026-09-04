"use strict";
"use client";

import React from "react";
import { EmiPlanDto } from "@/types/product";
import { formatINR, formatInterest } from "@/lib/formatters";
import { Check, Sparkles } from "lucide-react";
import clsx from "clsx";

interface EmiPlanCardProps {
  plan: EmiPlanDto;
  isSelected: boolean;
  onSelect: (plan: EmiPlanDto) => void;
}

export function EmiPlanCard({ plan, isSelected, onSelect }: EmiPlanCardProps) {
  const isBestValue = plan.tenureMonths === 12;

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
        "cursor-pointer select-none rounded-2xl p-4 sm:p-4.5 transition-all duration-200 border text-left relative",
        isSelected
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] shadow-premium-xs ring-1 ring-[var(--brand-primary)] dark:border-[#B7F34A]"
          : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#1F302A]"
      )}
    >
      {/* Best Value Badge for 12M Plan */}
      {isBestValue && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary-dark)] dark:text-[#0A110F] bg-[#C4F36A] px-2 py-0.5 rounded-full shadow-premium-xs border border-[var(--brand-primary)]/20">
          <Sparkles className="w-3 h-3" />
          <span>Best Value</span>
        </span>
      )}

      {/* Top Line: Monthly Amount x Tenure (Left) | Interest Rate (Right) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0",
              isSelected
                ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white dark:bg-[#B7F34A] dark:border-[#B7F34A] dark:text-[#0C1412]"
                : "border-[var(--text-muted)] bg-[var(--bg-surface)] dark:bg-[#131E1A]"
            )}
          >
            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </div>

          <div className="flex items-baseline gap-1.5 font-black text-[var(--text-primary)] dark:text-[#F2F5F3] text-sm sm:text-base tracking-tight">
            <span>{formatINR(plan.monthlyEmi)}</span>
            <span className="font-semibold text-[var(--text-secondary)] dark:text-[#9DA7A2] text-xs sm:text-sm">
              /mo
            </span>
            <span className="text-xs text-[var(--text-muted)] dark:text-[#6B7670] font-normal">
              × {plan.tenureMonths}m
            </span>
          </div>
        </div>

        <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] whitespace-nowrap">
          {plan.annualInterestRate === 0 ? (
            <span className="text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] px-2 py-0.5 rounded border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 text-xs font-bold">
              0% No Cost
            </span>
          ) : (
            <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2] font-medium">
              {formatInterest(plan.annualInterestRate)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Line: Additional Cashback in Green text */}
      {plan.cashbackAmount > 0 && (
        <div className="text-xs font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A] mt-2 pt-2 border-t border-[var(--border-subtle)] dark:border-[#1E2D27] flex items-center justify-between">
          <span>{plan.cashbackDescription || `Instant Cashback of ${formatINR(plan.cashbackAmount)}`}</span>
          <span className="text-[10px] bg-[var(--brand-primary)]/10 dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] px-1.5 py-0.5 rounded font-bold">
            Reward
          </span>
        </div>
      )}
    </div>
  );
}
