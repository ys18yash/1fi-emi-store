"use strict";
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { calculateEmi } from "@/lib/emi-calculator";
import { formatINR, formatInterest } from "@/lib/formatters";
import { EmiPlanDto } from "@/types/product";
import {
  Calculator,
  Percent,
  Calendar,
  Wallet,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface InteractiveEmiCalculatorProps {
  productPrice: number;
  productName: string;
  availablePlans?: EmiPlanDto[];
}

const SUPPORTED_TENURES = [3, 6, 12, 24, 36, 48, 60];
const SUPPORTED_RATES = [
  { label: "0% No-Cost", value: 0 },
  { label: "10.5% Low Interest", value: 10.5 },
];

export function InteractiveEmiCalculator({
  productPrice,
  productName,
  availablePlans = [],
}: InteractiveEmiCalculatorProps) {
  // Calculator state
  const [downPayment, setDownPayment] = useState<number>(0);
  const [downPaymentInput, setDownPaymentInput] = useState<string>("0");
  const [selectedTenure, setSelectedTenure] = useState<number>(12);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-adjust down payment if variant switches to a cheaper variant
  useEffect(() => {
    if (downPayment >= productPrice) {
      const adjusted = Math.max(0, Math.floor(productPrice * 0.2));
      setDownPayment(adjusted);
      setDownPaymentInput(adjusted.toString());
      setValidationError(null);
    }
  }, [productPrice, downPayment]);

  // Max allowed down payment (leaving at least ₹1000 for financing)
  const maxDownPayment = Math.max(0, productPrice - 1000);

  // Quick preset percentages for down payment
  const downPaymentPresets = [
    { label: "0% Down", pct: 0 },
    { label: "10%", pct: 0.1 },
    { label: "25%", pct: 0.25 },
    { label: "50%", pct: 0.5 },
  ];

  // Handle manual down payment text input
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setDownPaymentInput(rawVal);

    if (rawVal.trim() === "") {
      setValidationError("Down payment cannot be empty");
      setDownPayment(0);
      return;
    }

    const parsed = Number(rawVal);

    if (isNaN(parsed)) {
      setValidationError("Please enter a valid numeric amount");
      return;
    }

    if (parsed < 0) {
      setValidationError("Down payment cannot be negative");
      setDownPayment(0);
      return;
    }

    if (parsed >= productPrice) {
      setValidationError(
        `Down payment must be less than product price (${formatINR(productPrice)})`
      );
      setDownPayment(maxDownPayment);
      return;
    }

    setValidationError(null);
    setDownPayment(Math.floor(parsed));
  };

  // Handle slider adjustment
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDownPayment(val);
    setDownPaymentInput(val.toString());
    setValidationError(null);
  };

  // Quick preset click
  const handlePresetClick = (pct: number) => {
    const val = Math.floor(productPrice * pct);
    setDownPayment(val);
    setDownPaymentInput(val.toString());
    setValidationError(null);
  };

  // Reset to default
  const handleReset = () => {
    setDownPayment(0);
    setDownPaymentInput("0");
    setSelectedTenure(12);
    setSelectedRate(0);
    setValidationError(null);
  };

  // Calculate financing outputs using centralized calculation engine
  const loanAmount = Math.max(0, productPrice - downPayment);

  // Find matching cashback if available from predefined plans
  const matchedCashback = useMemo(() => {
    const matchingPlan = availablePlans.find(
      (p) => p.tenureMonths === selectedTenure && p.annualInterestRate === selectedRate
    );
    return matchingPlan ? matchingPlan.cashbackAmount : 0;
  }, [availablePlans, selectedTenure, selectedRate]);

  // Execute mathematical EMI calculation
  const calculatedResult = useMemo(() => {
    return calculateEmi({
      principal: loanAmount,
      tenureMonths: selectedTenure,
      annualInterestRate: selectedRate,
      cashbackAmount: matchedCashback,
    });
  }, [loanAmount, selectedTenure, selectedRate, matchedCashback]);

  // Repayment visualization calculations
  const totalRepayment = calculatedResult.totalPayable;
  const totalInterest = calculatedResult.totalInterest;
  const principalSharePct =
    totalRepayment > 0
      ? Math.round((loanAmount / totalRepayment) * 100)
      : 100;
  const interestSharePct = 100 - principalSharePct;

  return (
    <div className="bg-[var(--bg-surface)] dark:bg-[#131E1A] rounded-3xl border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] dark:border-[#1E2D27] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--brand-primary)]/20 dark:border-[#B7F34A]/20">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
              Interactive EMI Calculator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] mt-1">
            Simulate custom down payments and tenure for {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:text-[var(--text-primary)] dark:hover:text-[#F2F5F3] transition-colors py-1.5 px-3 rounded-xl border border-[var(--border-subtle)] dark:border-[#1E2D27] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#192722] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      {/* Main Grid: Inputs (Left) | Visual Outputs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Interactive Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Price & Down Payment Input Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="down-payment-input"
                className="text-xs font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] uppercase tracking-wider flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
                Down Payment Amount
              </label>
              <span className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2]">
                Product Price: <strong className="text-[var(--text-primary)] dark:text-[#F2F5F3] font-bold">{formatINR(productPrice)}</strong>
              </span>
            </div>

            {/* Input with INR Prefix */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted)] dark:text-[#6B7670]">
                ₹
              </span>
              <input
                id="down-payment-input"
                type="number"
                min="0"
                max={maxDownPayment}
                step="500"
                value={downPaymentInput}
                onChange={handleDownPaymentChange}
                placeholder="0"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
                  validationError
                    ? "border-rose-400 focus:ring-rose-200 text-rose-900 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-950/20"
                    : "border-[var(--border-subtle)] dark:border-[#1E2D27] focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary-subtle)] text-[var(--text-primary)] dark:text-[#F2F5F3] bg-[var(--bg-surface-subtle)] dark:bg-[#192722]"
                }`}
              />
            </div>

            {/* Validation Message */}
            {validationError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                <span>⚠️</span> {validationError}
              </p>
            )}

            {/* Range Slider */}
            <div className="pt-1">
              <input
                type="range"
                min="0"
                max={maxDownPayment}
                step="1000"
                value={downPayment}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-[var(--border-subtle)] dark:bg-[#1E2D27] rounded-lg appearance-none cursor-pointer accent-[var(--brand-primary)] dark:accent-[#B7F34A]"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-muted)] dark:text-[#6B7670] font-semibold mt-1">
                <span>₹0 (Zero Down)</span>
                <span>Max: {formatINR(maxDownPayment)}</span>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {downPaymentPresets.map((preset) => {
                const presetValue = Math.floor(productPrice * preset.pct);
                const isSelected = downPayment === presetValue;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset.pct)}
                    className={`text-xs py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--bg-surface-subtle)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2] hover:bg-[var(--border-subtle)] dark:hover:bg-[#1F302A] border border-[var(--border-subtle)] dark:border-[#1E2D27]"
                    }`}
                  >
                    {preset.label} ({formatINR(presetValue)})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interest Rate Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
              Interest Rate Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_RATES.map((rate) => {
                const isSelected = selectedRate === rate.value;
                return (
                  <button
                    key={rate.label}
                    type="button"
                    onClick={() => setSelectedRate(rate.value)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] text-[var(--brand-primary)] dark:text-[#B7F34A] ring-1 ring-[var(--brand-primary)] dark:border-[#B7F34A]"
                        : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] hover:border-[var(--brand-primary)]/40 text-[var(--text-primary)] dark:text-[#F2F5F3]"
                    }`}
                  >
                    <span className="text-xs font-bold block">{rate.label}</span>
                    <span className="text-[11px] text-[var(--text-secondary)] dark:text-[#9DA7A2] block mt-0.5">
                      {rate.value === 0 ? "Standard 0% interest" : "10.5% p.a. reducing"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A]" />
              Repayment Tenure
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {SUPPORTED_TENURES.map((months) => {
                const isSelected = selectedTenure === months;
                return (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setSelectedTenure(months)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-premium-xs"
                        : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#192722] hover:border-[var(--brand-primary)]/40 text-[var(--text-primary)] dark:text-[#F2F5F3] hover:bg-[var(--bg-surface-subtle)] dark:hover:bg-[#1F302A]"
                    }`}
                  >
                    {months}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Visualization (5 Cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-surface-subtle)] dark:bg-[#192722] rounded-2xl border border-[var(--border-subtle)] dark:border-[#1E2D27] p-5 sm:p-6 space-y-5">
          {/* Main Monthly EMI Callout */}
          <div className="bg-[var(--bg-surface)] dark:bg-[#131E1A] rounded-2xl p-4 border border-[var(--brand-primary)]/20 dark:border-[#1E2D27] shadow-premium-xs text-center">
            <span className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] font-bold uppercase tracking-wider block">
              Estimated Monthly Installment
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[var(--brand-primary)] dark:text-[#B7F34A] tracking-tight mt-1">
              {formatINR(calculatedResult.monthlyEmi)}
              <span className="text-xs font-normal text-[var(--text-secondary)] dark:text-[#9DA7A2]">/mo</span>
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)] dark:text-[#F2F5F3] block mt-1">
              For {selectedTenure} Months @ {formatInterest(selectedRate)}
            </span>
          </div>

          {/* Visual Breakdown Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
              <span>Repayment Breakdown</span>
              <span>Total: {formatINR(totalRepayment)}</span>
            </div>

            {/* Proportion Bar */}
            <div className="w-full h-3 bg-[var(--border-subtle)] dark:bg-[#1E2D27] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${principalSharePct}%` }}
                className="bg-[var(--brand-primary)] h-full transition-all duration-300"
                title={`Principal Loan: ${principalSharePct}%`}
              />
              {interestSharePct > 0 && (
                <div
                  style={{ width: `${interestSharePct}%` }}
                  className="bg-[#B7F34A] h-full transition-all duration-300"
                  title={`Interest: ${interestSharePct}%`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] dark:text-[#9DA7A2] font-semibold pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]" />
                <span>Loan: {formatINR(loanAmount)} ({principalSharePct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7F34A]" />
                <span>Interest: {formatINR(totalInterest)} ({interestSharePct}%)</span>
              </div>
            </div>
          </div>

          {/* Key Financial Metrics Table */}
          <div className="space-y-2 text-xs border-t border-[var(--border-subtle)] dark:border-[#1E2D27] pt-3">
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60 dark:border-[#1E2D27]/60">
              <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2]">Product Price</span>
              <span className="font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">{formatINR(productPrice)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60 dark:border-[#1E2D27]/60">
              <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2]">Down Payment</span>
              <span className="font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">
                - {formatINR(downPayment)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60 dark:border-[#1E2D27]/60">
              <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2]">Net Loan Amount</span>
              <span className="font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">{formatINR(loanAmount)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60 dark:border-[#1E2D27]/60">
              <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2]">Total Interest Payable</span>
              <span className="font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                {totalInterest === 0 ? "₹0 (0% No-Cost)" : formatINR(totalInterest)}
              </span>
            </div>
            {matchedCashback > 0 && (
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]/60 dark:border-[#1E2D27]/60">
                <span className="text-[var(--text-secondary)] dark:text-[#9DA7A2]">Eligible Cashback</span>
                <span className="font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">
                  - {formatINR(matchedCashback)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 font-black text-sm text-[var(--text-primary)] dark:text-[#F2F5F3] pt-1">
              <span>Effective Net Cost</span>
              <span className="text-[var(--brand-primary)] dark:text-[#B7F34A]">
                {formatINR(calculatedResult.netEffectiveCost + downPayment)}
              </span>
            </div>
          </div>

          {/* Informational Disclaimer */}
          <div className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)] dark:text-[#9DA7A2] bg-[var(--bg-surface)] dark:bg-[#131E1A] p-3 rounded-xl border border-[var(--border-subtle)] dark:border-[#1E2D27]">
            <Info className="w-3.5 h-3.5 text-[var(--brand-primary)] dark:text-[#B7F34A] shrink-0 mt-0.5" />
            <span>
              This calculator provides custom financing estimates. Standard pre-approved plans without down payment are selectable on the right panel.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
