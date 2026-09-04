"use strict";
"use client";

import React, { useState } from "react";
import { EmiPlanDto } from "@/types/product";
import { EmiPlanCard } from "./EmiPlanCard";
import { ShieldCheck } from "lucide-react";
import clsx from "clsx";

interface EmiPlanListProps {
  plans: EmiPlanDto[];
  selectedPlanId: string | null;
  onSelectPlan: (plan: EmiPlanDto) => void;
}

export function EmiPlanList({
  plans,
  selectedPlanId,
  onSelectPlan,
}: EmiPlanListProps) {
  const [filter, setFilter] = useState<"ALL" | "NO_COST" | "EXTENDED">("ALL");

  const filteredPlans = plans.filter((plan) => {
    if (filter === "NO_COST") return plan.isNoCost;
    if (filter === "EXTENDED") return plan.tenureMonths >= 24;
    return true;
  });

  return (
    <div className="space-y-3.5">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 pb-1">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            filter === "ALL"
              ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
              : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] bg-[var(--bg-surface-subtle)] dark:bg-[#192722] hover:bg-[var(--border-subtle)]/50 border border-[var(--border-subtle)] dark:border-[#1E2D27]"
          )}
        >
          All Plans ({plans.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("NO_COST")}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            filter === "NO_COST"
              ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
              : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] bg-[var(--bg-surface-subtle)] dark:bg-[#192722] hover:bg-[var(--border-subtle)]/50 border border-[var(--border-subtle)] dark:border-[#1E2D27]"
          )}
        >
          0% No-Cost
        </button>
        <button
          type="button"
          onClick={() => setFilter("EXTENDED")}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            filter === "EXTENDED"
              ? "bg-[var(--brand-primary)] text-white shadow-premium-xs"
              : "text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] bg-[var(--bg-surface-subtle)] dark:bg-[#192722] hover:bg-[var(--border-subtle)]/50 border border-[var(--border-subtle)] dark:border-[#1E2D27]"
          )}
        >
          Long Tenures (24m+)
        </button>
      </div>

      {/* EMI Plan Rows */}
      <div className="space-y-2.5">
        {filteredPlans.map((plan) => (
          <EmiPlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={onSelectPlan}
          />
        ))}

        {filteredPlans.length === 0 && (
          <div className="p-6 text-center text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] bg-[var(--bg-surface-subtle)] dark:bg-[#192722] rounded-2xl border border-dashed border-[var(--border-subtle)] dark:border-[#1E2D27]">
            No EMI plans match this filter.
          </div>
        )}
      </div>

      {/* Reassurance Info Banner */}
      <div className="flex items-center gap-2.5 p-3.5 bg-[var(--brand-primary-subtle)] dark:bg-[rgba(16,185,129,0.12)] rounded-xl border border-[var(--brand-primary)]/20 text-xs text-[var(--brand-primary)] dark:text-[#B7F34A] font-medium">
        <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)] dark:text-[#B7F34A] shrink-0" />
        <span>
          Instant digital lien via CAMS / KFintech. No paperwork, zero foreclosure penalty.
        </span>
      </div>
    </div>
  );
}
