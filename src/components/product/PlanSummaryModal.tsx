"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProductVariantDto, EmiPlanDto } from "@/types/product";
import { formatINR, formatInterest } from "@/lib/formatters";
import { X, CheckCircle2, ShieldCheck, ArrowRight, TrendingUp, Sparkles, Building2 } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[var(--bg-surface)] dark:bg-[#131E1A] p-6 sm:p-8 shadow-2xl border border-[var(--border-subtle)] dark:border-[#1E2D27] overflow-hidden animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setStep("SUMMARY");
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#192722] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "SUMMARY" ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Digital Lien Pledged EMI
                </span>
                <span className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] font-medium">
                  Order Summary
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
                {productName}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] font-medium mt-0.5">
                {variant.variantName} • {variant.colorName}
              </p>
            </div>

            {/* Monthly Installment Highlight Box */}
            <div className="rounded-2xl bg-[#101A17] dark:bg-[#0C1412] text-white p-5 border border-[#1F2E27] dark:border-[#1E2D27] space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider block">
                    Monthly Installment
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-[#B7F34A] tracking-tight">
                      {formatINR(plan.monthlyEmi)}
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      / month
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider block">
                    Financing Tenure
                  </span>
                  <span className="text-lg font-bold text-white mt-1 block">
                    {plan.tenureMonths} Months
                  </span>
                </div>
              </div>

              {plan.cashbackAmount > 0 && (
                <div className="pt-3 border-t border-[#1F2E27] dark:border-[#1E2D27] flex items-center justify-between text-xs font-semibold text-emerald-200">
                  <span>{plan.cashbackDescription}</span>
                  <span className="bg-[#B7F34A]/20 text-[#B7F34A] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#B7F34A]/30">
                    Saved {formatINR(plan.cashbackAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Financial Details Table */}
            <div className="space-y-2 text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] py-2 border-y border-[var(--border-subtle)] dark:border-[#1E2D27]">
              <div className="flex justify-between py-1">
                <span>Product Selling Price</span>
                <span className="font-semibold text-[var(--text-primary)] dark:text-[#F2F5F3]">{formatINR(variant.price)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Annual Interest Rate</span>
                <span className="font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A]">{formatInterest(plan.annualInterestRate)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Total Repayment Amount</span>
                <span className="font-semibold text-[var(--text-primary)] dark:text-[#F2F5F3]">{formatINR(plan.totalPayable)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Instant Cashback Reward</span>
                <span className="font-semibold text-[var(--brand-primary)] dark:text-[#B7F34A]">−{formatINR(plan.cashbackAmount)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-[var(--text-primary)] dark:text-[#F2F5F3] border-t border-[var(--border-subtle)] dark:border-[#1E2D27]">
                <span>Net Effective Cost</span>
                <span className="text-[var(--brand-primary)] dark:text-[#B7F34A] font-black">{formatINR(plan.netEffectiveCost)}</span>
              </div>
              <div className="flex justify-between py-2 bg-[var(--bg-surface-subtle)] dark:bg-[#192722] px-3.5 rounded-xl text-[var(--text-primary)] dark:text-[#F2F5F3] font-semibold border border-[var(--border-subtle)] dark:border-[#1E2D27]">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" /> Required MF Pledge (1.5x)
                </span>
                <span className="font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">{formatINR(plan.requiredMfPledge)}</span>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#192722] p-4 text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] space-y-2 border border-[var(--border-subtle)] dark:border-[#1E2D27]">
              <div className="font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
                <span>Next 3 Simple Steps on 1Fi:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-[var(--text-secondary)] dark:text-[#9DA7A2] font-medium leading-relaxed">
                <li>Instant limit approval via PAN & Aadhaar OTP</li>
                <li>Pledge mutual fund units digitally via CAMS/KFintech lien</li>
                <li>Device dispatched immediately with brand warranty</li>
              </ol>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              onClick={() => setStep("CONFIRMED")}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
            >
              <span>Initialize Digital Pledge Application</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] mx-auto flex items-center justify-center border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
              Application Initialized
            </span>

            <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
              Plan Selected Successfully!
            </h3>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-sm mx-auto leading-relaxed">
              You selected the <strong className="text-[var(--text-primary)] dark:text-[#F2F5F3] font-bold">{plan.tenureMonths}-Month EMI plan ({formatINR(plan.monthlyEmi)}/mo)</strong> for your <strong className="text-[var(--text-primary)] dark:text-[#F2F5F3] font-bold">{productName} ({variant.variantName})</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-[#101A17] dark:bg-[#0C1412] text-white text-left border border-[#1F2E27] dark:border-[#1E2D27] text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#B7F34A]">
                <TrendingUp className="w-4 h-4" />
                <span>Financing Breakdown</span>
              </div>
              <div className="text-xs text-gray-300 leading-relaxed space-y-1">
                <div className="flex justify-between"><span>Monthly Installment:</span> <strong className="text-white">{formatINR(plan.monthlyEmi)}</strong></div>
                <div className="flex justify-between"><span>Tenure:</span> <strong className="text-white">{plan.tenureMonths} Months</strong></div>
                <div className="flex justify-between"><span>Total Financed:</span> <strong className="text-white">{formatINR(plan.totalPayable)}</strong></div>
                <div className="flex justify-between"><span>Cashback Reward:</span> <strong className="text-[#B7F34A]">{formatINR(plan.cashbackAmount)}</strong></div>
                <div className="flex justify-between pt-1 border-t border-[#1F2E27] dark:border-[#1E2D27]"><span>Pledged Portfolio:</span> <strong className="text-[#B7F34A]">{formatINR(plan.requiredMfPledge)} (keeps compounding!)</strong></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("SUMMARY");
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[var(--text-primary)] hover:bg-black dark:bg-[#192722] dark:hover:bg-[#22352E] dark:border dark:border-[#1E2D27] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done & Return to Store
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}


