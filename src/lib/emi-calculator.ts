import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";

/**
 * Financial Calculation Engine for 1Fi Mutual Fund-backed EMI Store
 */

export interface EmiCalculationParams {
  principal: number; // Principal loan amount in INR
  tenureMonths: number; // Tenure in months (e.g. 3, 6, 12, 24, 36, 48, 60)
  annualInterestRate: number; // Annual interest rate in percent (e.g. 0.0 or 10.5)
  cashbackAmount?: number; // Cashback if applicable in INR (e.g. 7500)
  minPledgeMultiplier?: number; // MF Collateral ratio (typically 1.5x)
}

export interface CalculatedEmiResult {
  monthlyEmi: number;
  tenureMonths: number;
  annualInterestRate: number;
  isNoCost: boolean;
  totalPayable: number;
  totalInterest: number;
  cashbackAmount: number;
  netEffectiveCost: number;
  requiredMfPledge: number;
  monthlyMutualFundGrowthEstimated: number;
}

/**
 * Calculates monthly EMI using the standard Reducing Balance Formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Where:
 * P = Principal loan amount
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEmi({
  principal,
  tenureMonths,
  annualInterestRate,
  cashbackAmount = 0,
  minPledgeMultiplier = DEFAULT_MIN_PLEDGE_MULTIPLIER,
}: EmiCalculationParams): CalculatedEmiResult {
  const isNoCost = annualInterestRate === 0;
  let monthlyEmi = 0;
  let totalPayable = 0;
  let totalInterest = 0;

  if (isNoCost || annualInterestRate <= 0) {
    monthlyEmi = Math.round(principal / tenureMonths);
    totalPayable = principal;
    totalInterest = 0;
  } else {
    const monthlyRate = annualInterestRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEmi = Math.round((principal * monthlyRate * factor) / (factor - 1));
    totalPayable = monthlyEmi * tenureMonths;
    totalInterest = Math.max(0, totalPayable - principal);
  }

  const netEffectiveCost = Math.max(0, totalPayable - cashbackAmount);
  const requiredMfPledge = Math.round(principal * minPledgeMultiplier);

  // Use centralized CAGR constant
  const tenureYears = tenureMonths / 12;
  const projectedMfValue = Math.round(
    requiredMfPledge * Math.pow(1 + MF_ANNUAL_CAGR, tenureYears)
  );
  const estimatedMfGrowth = projectedMfValue - requiredMfPledge;

  return {
    monthlyEmi,
    tenureMonths,
    annualInterestRate,
    isNoCost,
    totalPayable,
    totalInterest,
    cashbackAmount,
    netEffectiveCost,
    requiredMfPledge,
    monthlyMutualFundGrowthEstimated: Math.round(
      estimatedMfGrowth / tenureMonths
    ),
  };
}
