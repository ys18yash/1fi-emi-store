"use strict";
"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp, ShieldCheck, ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import clsx from "clsx";

const SIMULATION_DEVICES = [
  {
    name: "iPhone 17 Pro",
    tagline: "Apple A19 Pro (3nm)",
    price: 127400,
    emi12m: 11242,
    pledge: Math.round(127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
  },
  {
    name: "Galaxy S25 Ultra",
    tagline: "Snapdragon 8 Elite",
    price: 129999,
    emi12m: 10833,
    pledge: Math.round(129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
  },
  {
    name: "Pixel 10 Pro",
    tagline: "Google Tensor G5",
    price: 99999,
    emi12m: 8333,
    pledge: Math.round(99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR),
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
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
    <div className="relative w-full max-w-[460px] mx-auto lg:ml-auto lg:mr-0">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#087443]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Visualization Stage */}
      <div className="rounded-3xl bg-[#101A17] text-white p-5 sm:p-6 shadow-premium-lg border border-[#1F2E27] relative overflow-hidden space-y-4">
        {/* Top Header: Switcher Chips */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#1F2E27]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C4F36A]">
              Wealth Compounding Flow
            </span>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-[#172420] p-1 rounded-xl border border-[#1F2E27]">
            {SIMULATION_DEVICES.map((dev, idx) => (
              <button
                key={dev.name}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                  selectedIndex === idx
                    ? "bg-[#087443] text-white shadow-xs"
                    : "text-[#8D95A0] hover:text-white"
                )}
              >
                {dev.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Device + Price Stage */}
        <div className="grid grid-cols-12 gap-4 items-center bg-[#172420] p-4 rounded-2xl border border-[#1F2E27]">
          {/* Device Thumbnail */}
          <div className="col-span-4 aspect-square bg-[#101A17] rounded-xl p-2 flex items-center justify-center border border-[#1F2E27]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSim.image}
              alt={activeSim.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Pricing & Tenure */}
          <div className="col-span-8 space-y-1">
            <div className="text-xs text-[#8D95A0] font-medium">{activeSim.name}</div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              <AnimatedNumber value={activeSim.price} />
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#087443]/30 text-[#C4F36A] font-semibold border border-[#087443]/40">
                12 × <AnimatedNumber value={activeSim.emi12m} />/mo
              </span>
              <span className="text-[#8D95A0] text-[11px]">0% No-Cost</span>
            </div>
          </div>
        </div>

        {/* Animated Connecting Flow Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#8D95A0]">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#1F2E27]" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172420] border border-[#1F2E27] text-[10px] font-semibold text-[#C4F36A]">
            <ArrowDown className="w-3 h-3 text-[#B7F34A] animate-bounce" />
            <span>Mutual Fund Units Remain Pledged & Invested</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#1F2E27]" />
        </div>

        {/* Investment Portfolio Outcome Card */}
        <div className="bg-[#172420] p-4 sm:p-5 rounded-2xl border border-[#087443]/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <TrendingUp className="w-4 h-4 text-[#B7F34A]" />
              <span>Your Portfolio Growth</span>
            </div>
            <span className="text-[11px] font-bold text-[#B7F34A] bg-[#087443]/40 border border-[#087443] px-2 py-0.5 rounded-full">
              {Math.round(MF_ANNUAL_CAGR * 100)}% Annual CAGR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#101A17] border border-[#1F2E27]">
              <span className="text-[11px] text-[#8D95A0] block">Pledged Collateral</span>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                <AnimatedNumber value={activeSim.pledge} />
              </div>
              <span className="text-[10px] text-[#8D95A0]">1.5x of Device Value</span>
            </div>

            <div className="p-3 rounded-xl bg-[#101A17] border border-[#087443]/40">
              <span className="text-[11px] text-[#C4F36A] block">Est. Compounded Gain</span>
              <div className="text-base sm:text-lg font-bold text-[#B7F34A] mt-0.5">
                +<AnimatedNumber value={activeSim.growth} />
              </div>
              <span className="text-[10px] text-[#8D95A0]">Continues Compounding</span>
            </div>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-between text-xs text-[#8D95A0] pt-1 border-t border-[#1F2E27]/80">
          <div className="flex items-center gap-1.5 text-[11px] text-white">
            <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
            <span>Digital Lien via CAMS / KFintech</span>
          </div>
          <span className="text-[11px] text-[#8D95A0]">Zero Foreclosure Fees</span>
        </div>
      </div>
    </div>
  );
}
