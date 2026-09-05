"use strict";
"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp, ShieldCheck, ArrowDown } from "lucide-react";
import clsx from "clsx";

const SIMULATION_DEVICES = [
  {
    name: "iPhone 17 Pro",
    tagline: "Apple A19 Pro (3nm)",
    price: 127400,
    emi12m: 11242,
    pledge: Math.round(127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "/images/products/real/iphone17pro-silver/image-1.jpg",
  },
  {
    name: "Galaxy S25 Ultra",
    tagline: "Snapdragon 8 Elite",
    price: 129999,
    emi12m: 10833,
    pledge: Math.round(129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "/images/products/real/samsung-s25-black/image-1.jpg",
  },
  {
    name: "Pixel 10 Pro",
    tagline: "Google Tensor G5",
    price: 99999,
    emi12m: 8333,
    pledge: Math.round(99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "/images/products/real/pixel10-frost/image-1.jpg",
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const duration = 300;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (value - startValue) * easeProgress);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value]);

  return <span>{formatINR(displayValue)}</span>;
}

export function HeroVisualizer() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeSim = SIMULATION_DEVICES[selectedIndex];

  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:ml-auto lg:mr-0">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#087443]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Visualization Card matching green-shade screenshot */}
      <div className="rounded-[28px] sm:rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden space-y-4 transition-colors">
        {/* Top Header: Switcher Chips */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#087443] dark:bg-[#10b981]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#087443] dark:text-[#34d399]">
              WEALTH COMPOUNDING FLOW
            </span>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-[#f3f4f6] dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            {SIMULATION_DEVICES.map((dev, idx) => (
              <button
                key={dev.name}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  selectedIndex === idx
                    ? "bg-[#087443] text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {dev.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Device + Price Stage with soft sage-green background */}
        <div className="flex items-center gap-4 bg-[#f0f4f1] dark:bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-[#e2eae4] dark:border-slate-700/60">
          {/* Device Thumbnail */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square bg-white dark:bg-slate-900 rounded-2xl p-2.5 flex items-center justify-center border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSim.image}
              alt={activeSim.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Pricing & Tenure */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{activeSim.name}</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <AnimatedNumber value={activeSim.price} />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-[#e6f7ee] dark:bg-[#064e3b]/50 text-[#087443] dark:text-[#34d399] font-bold text-xs border border-[#a7f3d0] dark:border-[#059669]/40">
                12 × <AnimatedNumber value={activeSim.emi12m} />/mo
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">0% No-Cost</span>
            </div>
          </div>
        </div>

        {/* Middle Connector with horizontal rule & centered badge */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
          </div>
          <div className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-[#a7f3d0] dark:border-[#059669]/60 text-xs font-semibold text-[#087443] dark:text-[#34d399] shadow-xs">
            <ArrowDown className="w-3.5 h-3.5 text-[#087443] dark:text-[#34d399]" />
            <span>Mutual Fund Units Remain Pledged & Invested</span>
          </div>
        </div>

        {/* Investment Portfolio Outcome Card with sage-green background */}
        <div className="bg-[#f0f4f1] dark:bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-[#cce5d6] dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <TrendingUp className="w-4 h-4 text-[#087443] dark:text-[#34d399]" />
              <span>Your Portfolio Growth</span>
            </div>
            <span className="text-xs font-bold text-[#087443] dark:text-[#34d399] bg-[#e6f7ee] dark:bg-[#064e3b]/50 border border-[#a7f3d0] dark:border-[#059669]/40 px-3 py-1 rounded-full">
              {Math.round(MF_ANNUAL_CAGR * 100)}% Annual CAGR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Pledged Collateral</span>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                <AnimatedNumber value={activeSim.pledge} />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">1.5x of Device Value</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#86efac] dark:border-[#059669]/60 shadow-xs">
              <span className="text-xs text-[#087443] dark:text-[#34d399] font-bold block">Est. Compounded Gain</span>
              <div className="text-lg sm:text-xl font-extrabold text-[#087443] dark:text-[#34d399] mt-1 tracking-tight">
                +<AnimatedNumber value={activeSim.growth} />
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Continues Compounding</span>
            </div>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#087443] dark:text-[#34d399]" />
            <span>Digital Lien via CAMS / KFintech</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Zero Foreclosure Fees</span>
        </div>
      </div>
    </div>
  );
}
