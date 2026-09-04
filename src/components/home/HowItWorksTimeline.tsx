"use strict";

import React from "react";
import { Smartphone, CheckCircle2, Lock, Gift, Sparkles } from "lucide-react";

export function HowItWorksTimeline() {
  const steps = [
    {
      stepNumber: "01",
      title: "Discover & Configure",
      description: "Pick your flagship smartphone or laptop, choose your favorite finish and storage tier, and compare 3 to 60-month EMI tenures.",
      icon: Smartphone,
    },
    {
      stepNumber: "02",
      title: "Instant Eligibility Check",
      description: "Verify your investment-backed credit limit in under 10 seconds using your PAN and registered mobile number.",
      icon: CheckCircle2,
    },
    {
      stepNumber: "03",
      title: "Pledge Mutual Funds",
      description: "Mark a secure digital lien on your existing mutual fund units via CAMS, KFintech, or MFCentral OTP authentication.",
      icon: Lock,
    },
    {
      stepNumber: "04",
      title: "Deliver & Keep Growing",
      description: "Your product is dispatched with standard brand warranty while your pledged mutual funds stay invested and keep compounding.",
      icon: Gift,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[var(--bg-page)] dark:bg-[#0C1412] scroll-mt-16 border-t border-[var(--border-subtle)] dark:border-[#1E2D27] relative">
      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] border border-[var(--brand-primary)]/30 dark:border-[#B7F34A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frictionless 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
            How LAMF Purchasing Works
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xl mx-auto leading-relaxed">
            No branch visits or paperwork. A 100% digital experience designed for modern mutual fund investors.
          </p>
        </div>

        {/* Desktop Horizontal Connected Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-6 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-12 right-12 h-px bg-[var(--border-subtle)] dark:bg-[#1E2D27] -z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative z-10 flex flex-col items-start p-6 rounded-3xl bg-[var(--bg-surface-subtle)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs hover:border-[var(--brand-primary)]/50 hover:shadow-premium-md transition-all duration-300 group"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--bg-surface)] dark:bg-[#192722] text-[var(--brand-primary)] dark:text-[#B7F34A] border border-[var(--border-subtle)] dark:border-[#1E2D27] flex items-center justify-center font-bold group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-[var(--text-muted)]/40 group-hover:text-[var(--brand-primary)] dark:group-hover:text-[#B7F34A] transition-colors font-mono">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] dark:text-[#F2F5F3] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Stepped Timeline */}
        <div className="lg:hidden space-y-3.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-surface-subtle)] dark:bg-[#131E1A] border border-[var(--border-subtle)] dark:border-[#1E2D27] shadow-premium-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] dark:bg-[#192722] border border-[var(--border-subtle)] dark:border-[#1E2D27] text-[var(--brand-primary)] dark:text-[#B7F34A] flex items-center justify-center shrink-0 font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[var(--brand-primary)] dark:text-[#B7F34A]">
                      STEP {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
