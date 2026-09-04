"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp } from "lucide-react";

export function FinancingExplainer() {
  const [devicePrice, setDevicePrice] = useState<number>(127400);
  const [tenure, setTenure] = useState<number>(12);

  const pledgeRequired = Math.round(devicePrice * DEFAULT_MIN_PLEDGE_MULTIPLIER);
  const monthlyEmi = Math.round(devicePrice / tenure);
  const projectedMfGain = Math.round(
    pledgeRequired * (Math.pow(1 + MF_ANNUAL_CAGR, tenure / 12) - 1)
  );

  return (
    <section id="financing" className="py-20 bg-white scroll-mt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#6C28D9] bg-purple-50 border border-purple-200">
            Interactive Financing Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
            The mathematical structure of LAMF purchases
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Understand how collateral pledging works without transferring ownership or selling any of your units.
          </p>
        </div>

        {/* 4-Step Interactive Calculation Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative items-stretch">
          {/* Box 1: Product Value */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                01. Device Value
              </span>
              <div className="text-2xl font-bold text-gray-950 mt-1 tracking-tight">
                {formatINR(devicePrice)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Invoice amount for the selected device.
              </p>
            </div>
            <div className="pt-2">
              <label className="text-[10px] text-gray-400 font-medium block mb-1.5">
                Try custom price:
              </label>
              <input
                type="range"
                min="50000"
                max="200000"
                step="5000"
                value={devicePrice}
                onChange={(e) => setDevicePrice(Number(e.target.value))}
                className="w-full accent-[#6C28D9] cursor-pointer"
              />
            </div>
          </div>

          {/* Box 2: Portfolio Collateral */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C28D9]">
                02. Collateral ({DEFAULT_MIN_PLEDGE_MULTIPLIER}x)
              </span>
              <div className="text-2xl font-bold text-[#6C28D9] mt-1 tracking-tight">
                {formatINR(pledgeRequired)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Units remain in your demat/folio.
              </p>
            </div>
            <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
              ✓ 100% Remains in your name
            </div>
          </div>

          {/* Box 3: Monthly EMI */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                03. Monthly EMI ({tenure}m)
              </span>
              <div className="text-2xl font-bold text-gray-950 mt-1 tracking-tight">
                {formatINR(monthlyEmi)}
                <span className="text-xs font-normal text-gray-500 ml-1">/mo</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Debited via auto-mandate monthly.
              </p>
            </div>
            <div className="flex gap-1.5 pt-2">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTenure(m)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    tenure === m
                      ? "bg-[#6C28D9] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Box 4: Wealth Gain */}
          <div className="p-6 rounded-2xl bg-gray-950 text-white border border-gray-800 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                04. Est. Portfolio Gain
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 tracking-tight">
                +{formatINR(projectedMfGain)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Estimated growth at {Math.round(MF_ANNUAL_CAGR * 100)}% CAGR over tenure.
              </p>
            </div>
            <div className="text-[11px] text-gray-300 flex items-center gap-1.5 font-medium border-t border-gray-800 pt-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Lien released upon final EMI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

