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
    <div className="space-y-3">
      {/* Unified Filter Tabs (consistent #6C28D9 active state) */}
      <div className="flex items-center gap-2 pb-1">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
            filter === "ALL"
              ? "bg-[#6C28D9] text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
          )}
        >
          All Plans ({plans.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("NO_COST")}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
            filter === "NO_COST"
              ? "bg-[#6C28D9] text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
          )}
        >
          0% No-Cost
        </button>
        <button
          type="button"
          onClick={() => setFilter("EXTENDED")}
          className={clsx(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
            filter === "EXTENDED"
              ? "bg-[#6C28D9] text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"
          )}
        >
          Long Tenures (24m+)
        </button>
      </div>

      {/* EMI Plan Rows */}
      <div className="space-y-2">
        {filteredPlans.map((plan) => (
          <EmiPlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={onSelectPlan}
          />
        ))}

        {filteredPlans.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No EMI plans match this filter.
          </div>
        )}
      </div>

      {/* Reassurance Info Banner */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 font-normal">
        <ShieldCheck className="w-4 h-4 text-[#6C28D9] shrink-0" />
        <span>
          Instant digital lien via CAMS / KFintech. No paperwork, zero foreclosure penalty.
        </span>
      </div>
    </div>
  );
}

