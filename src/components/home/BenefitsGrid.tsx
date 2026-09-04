import React from "react";
import { TrendingUp, Percent, ShieldCheck, Clock, RefreshCw } from "lucide-react";

export function BenefitsGrid() {
  return (
    <section id="benefits" className="py-20 bg-white scroll-mt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#6C28D9] bg-purple-50 border border-purple-200">
            Why Investment-Backed Purchases
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
            Keep your wealth compounding while enjoying today
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Comparing the smart financing model against breaking your hard-earned investments or paying high credit card interest.
          </p>
        </div>

        {/* 2-Column Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Featured Comparison Insight Tile (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-gray-950 text-white p-7 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden border border-gray-800">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium text-white border border-white/10">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Financial Case Study</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                Selling Mutual Funds vs 1Fi EMI
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                When you break a ₹1.3L mutual fund investment to buy a smartphone, you lose future compounding and pay capital gains tax. Pledging units lets your ₹1.3L continue compounding to ~₹1.75L in 3 years!
              </p>

              {/* Stat Comparison Box */}
              <div className="pt-2 space-y-2 text-xs">
                <div className="p-3.5 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between">
                  <span className="text-gray-400">Redeeming Mutual Funds:</span>
                  <span className="font-semibold text-rose-400">Loss of ~₹45,000 future gains</span>
                </div>
                <div className="p-3.5 rounded-lg bg-purple-950/40 border border-purple-900/50 flex items-center justify-between">
                  <span className="text-purple-200">1Fi EMI Financing:</span>
                  <span className="font-semibold text-emerald-400">100% Compounding Retained</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>Zero Foreclosure Penalty</span>
              <span className="font-semibold text-white">Full Digital Control</span>
            </div>
          </div>

          {/* Right Column: 4 Modular Benefit Tiles (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tile 1: Zero Tax Impact */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-shadow space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#6C28D9] flex items-center justify-center font-semibold">
                <Percent className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-gray-950">
                Zero Capital Gains Tax
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Since no mutual fund units are sold, you trigger zero capital gains tax liabilities (LTCG / STCG).
              </p>
            </div>

            {/* Tile 2: No Hard Credit Check */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-shadow space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-gray-950">
                Backed by Collateral
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your purchasing limit is determined by your verified portfolio value, eliminating traditional credit score friction.
              </p>
            </div>

            {/* Tile 3: Extended Tenures */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-shadow space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#6C28D9] flex items-center justify-center font-semibold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-gray-950">
                3 to 60-Month Tenures
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Select short 0% No-Cost EMI tenures or extend up to 5 years for comfortable monthly installments.
              </p>
            </div>

            {/* Tile 4: Automatic Lien Removal */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-shadow space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-semibold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-gray-950">
                Instant Digital Release
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upon final EMI payment or loan pre-closure, the lien on your mutual fund units is released automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

