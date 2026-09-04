"use client";

import React, { useState } from "react";
import { ProductVariantDto, EmiPlanDto } from "@/types/product";
import { formatINR, formatInterest } from "@/lib/formatters";
import { X, CheckCircle2, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";

interface PlanSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  variant: ProductVariantDto;
  plan: EmiPlanDto;
}

export function PlanSummaryModal({
  isOpen,
  onClose,
  productName,
  variant,
  plan,
}: PlanSummaryModalProps) {
  const [step, setStep] = useState<"SUMMARY" | "CONFIRMED">("SUMMARY");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-200 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setStep("SUMMARY");
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "SUMMARY" ? (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-50 text-[#6C28D9] border border-purple-200">
                  Loan Against Mutual Funds (LAMF)
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Financing Summary
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-950 tracking-tight">
                {productName}
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                {variant.variantName} • {variant.colorName}
              </p>
            </div>

            {/* Price & Monthly EMI Highlight Box */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                    Monthly Installment
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl font-black text-[#6C28D9] tracking-tight">
                      {formatINR(plan.monthlyEmi)}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      / month
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                    Tenure
                  </span>
                  <span className="text-base font-bold text-gray-900 mt-0.5 block">
                    {plan.tenureMonths} Months
                  </span>
                </div>
              </div>

              {plan.cashbackAmount > 0 && (
                <div className="pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>{plan.cashbackDescription}</span>
                  <span className="bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                    Saved {formatINR(plan.cashbackAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Financial Details Table */}
            <div className="space-y-2 text-xs text-gray-600 py-2 border-y border-gray-100">
              <div className="flex justify-between py-1">
                <span>Product Selling Price</span>
                <span className="font-semibold text-gray-900">{formatINR(variant.price)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Annual Interest Rate</span>
                <span className="font-semibold text-emerald-700">{formatInterest(plan.annualInterestRate)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Total Repayment Amount</span>
                <span className="font-semibold text-gray-900">{formatINR(plan.totalPayable)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Cashback Benefit Applied</span>
                <span className="font-semibold text-emerald-700">−{formatINR(plan.cashbackAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm text-gray-950 border-t border-gray-100">
                <span>Net Effective Cost</span>
                <span className="text-[#6C28D9] font-bold">{formatINR(plan.netEffectiveCost)}</span>
              </div>
              <div className="flex justify-between py-1.5 bg-gray-50 px-3 rounded-lg text-gray-900 font-semibold border border-gray-200">
                <span>Mutual Fund Collateral to Pledge (1.5x)</span>
                <span>{formatINR(plan.requiredMfPledge)}</span>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="rounded-lg bg-gray-50 p-3.5 text-xs text-gray-600 space-y-1.5 border border-gray-200">
              <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6C28D9]" />
                <span>Next 3 Simple Steps on 1Fi:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600">
                <li>Verify your credit limit with PAN & Mobile OTP (10 seconds)</li>
                <li>Digital lien pledge of mutual fund units via CAMS/KFintech</li>
                <li>Instant order dispatch with official brand sealed warranty</li>
              </ol>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              onClick={() => setStep("CONFIRMED")}
              className="w-full py-3.5 px-6 rounded-lg bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-shadow flex items-center justify-center gap-2 group"
            >
              <span>Initialize Digital Pledge Application</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              Application Initialized
            </span>

            <h3 className="text-2xl font-bold text-gray-950 tracking-tight">
              Plan Selected Successfully!
            </h3>

            <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
              You selected the <strong className="text-gray-900 font-semibold">{plan.tenureMonths}-Month EMI plan ({formatINR(plan.monthlyEmi)}/mo)</strong> for your <strong className="text-gray-900 font-semibold">{productName} ({variant.variantName})</strong>.
            </p>

            <div className="p-4 rounded-lg bg-gray-50 text-left border border-gray-200 text-xs space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5 text-gray-900">
                <TrendingUp className="w-4 h-4 text-[#6C28D9]" />
                <span>Financing Breakdown</span>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                • Monthly Installment: <strong>{formatINR(plan.monthlyEmi)}</strong><br />
                • Tenure: <strong>{plan.tenureMonths} Months</strong><br />
                • Total Financed: <strong>{formatINR(plan.totalPayable)}</strong><br />
                • Cashback Reward: <strong>{formatINR(plan.cashbackAmount)}</strong><br />
                • Pledged Portfolio: <strong>{formatINR(plan.requiredMfPledge)}</strong> (keeps compounding!)
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("SUMMARY");
                onClose();
              }}
              className="w-full py-3 px-4 rounded-lg bg-gray-950 hover:bg-black text-white font-semibold text-xs transition-colors"
            >
              Done & Return to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

