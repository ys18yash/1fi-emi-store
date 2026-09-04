"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/formatters";
import { MF_ANNUAL_CAGR, DEFAULT_MIN_PLEDGE_MULTIPLIER } from "@/lib/constants";
import { TrendingUp, ShieldCheck } from "lucide-react";
import clsx from "clsx";

const SIMULATION_DEVICES = [
  {
    name: "iPhone 17 Pro",
    price: 127400,
    emi12m: 11242,
    pledge: Math.round(127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(
      127400 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR
    ),
  },
  {
    name: "Galaxy S25 Ultra",
    price: 129999,
    emi12m: 10833,
    pledge: Math.round(129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(
      129999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR
    ),
  },
  {
    name: "Pixel 10 Pro",
    price: 99999,
    emi12m: 8333,
    pledge: Math.round(99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER),
    growth: Math.round(
      99999 * DEFAULT_MIN_PLEDGE_MULTIPLIER * MF_ANNUAL_CAGR
    ),
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const duration = 350;

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
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main Card — Clean Elevation & Solid Borders */}
      <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-gray-200 space-y-5">
        {/* Card Header: Device Tabs */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Live LAMF Calculator
            </span>
          </div>

          {/* Device Switcher Chips */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {SIMULATION_DEVICES.map((dev, idx) => (
              <button
                key={dev.name}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  selectedIndex === idx
                    ? "bg-white text-gray-950 shadow-xs font-semibold"
                    : "text-gray-600 hover:text-gray-950"
                )}
              >
                {dev.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Central Metric Display */}
        <div className="grid grid-cols-2 gap-3">
          {/* Box 1: Device Value & EMI */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs font-normal text-gray-500 block">
              {activeSim.name} Price
            </span>
            <div className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight mt-1">
              <AnimatedNumber value={activeSim.price} />
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className="text-gray-500">12-Mo EMI:</span>
              <span className="font-semibold text-[#6C28D9]">
                <AnimatedNumber value={activeSim.emi12m} />/mo
              </span>
            </div>
          </div>

          {/* Box 2: Mutual Fund Pledged & Growth */}
          <div className="p-3.5 rounded-lg bg-purple-50/40 border border-purple-100">
            <span className="text-xs font-normal text-purple-900 block">
              Pledged MF ({DEFAULT_MIN_PLEDGE_MULTIPLIER}x)
            </span>
            <div className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight mt-1">
              <AnimatedNumber value={activeSim.pledge} />
            </div>
            <div className="mt-2.5 pt-2 border-t border-purple-200/50 flex items-center justify-between text-xs">
              <span className="text-gray-500">Est. Growth:</span>
              <span className="font-semibold text-emerald-700">
                +<AnimatedNumber value={activeSim.growth} />
              </span>
            </div>
          </div>
        </div>

        {/* Visual Wealth Growth Graph Bar */}
        <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#6C28D9]" />
              <span>Investment Portfolio Outcome</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {Math.round(MF_ANNUAL_CAGR * 100)}% CAGR
            </span>
          </div>

          {/* Comparison Track */}
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-gray-500 text-[11px] mb-1">
                <span>Selling Mutual Funds (Lost Value)</span>
                <span className="text-rose-600 font-medium">Loses compounding</span>
              </div>
              <div className="w-full h-2 rounded-full bg-rose-100 overflow-hidden">
                <div className="w-1/3 h-full bg-rose-400 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-800 text-[11px] font-medium mb-1">
                <span>1Fi Mutual Fund EMI</span>
                <span className="text-emerald-700 font-semibold">Keeps Growing to ₹{(activeSim.pledge + activeSim.growth).toLocaleString("en-IN")}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div className="w-full h-full bg-[#6C28D9] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1.5 text-gray-700 font-normal text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#6C28D9]" />
            <span>Digital Lien via CAMS / KFintech</span>
          </div>
          <span className="text-[11px] font-normal text-gray-400">Zero Foreclosure Fees</span>
        </div>
      </div>
    </div>
  );
}
