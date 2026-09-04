"use strict";
"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import clsx from "clsx";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I have to sell or redeem my mutual fund units to buy a device?",
    answer: "No. Your mutual fund units are never sold or redeemed. You only mark a digital lien (pledge) through CAMS, KFintech, or MFCentral. The units stay in your investment portfolio, continue receiving dividend/growth returns, and remain 100% under your ownership.",
  },
  {
    question: "How does 0% No-Cost EMI work with mutual funds?",
    answer: "On eligible products and tenures (typically 3, 6, 12, or 24 months), the interest cost is subsidized by partner discounts and cashback rewards, allowing you to pay zero extra interest over the standard selling price.",
  },
  {
    question: "What mutual funds can I pledge for purchasing devices?",
    answer: "Most equity, hybrid, and debt mutual funds registered with CAMS and KFintech RTAs across leading Indian AMCs (such as HDFC, ICICI Prudential, SBI, Nippon India, Axis, Mirae Asset, etc.) are eligible.",
  },
  {
    question: "What happens after I pay off all my EMIs?",
    answer: "Once the last installment is debited or if you choose to pre-close the loan early with zero foreclosure charges, the digital lien on your pledged mutual fund units is automatically removed.",
  },
  {
    question: "Is there any impact on my CIBIL credit score?",
    answer: "Because the facility is backed by your own investment collateral, the onboarding eligibility process does not rely on traditional hard credit inquiries. Making timely monthly repayments will also positively contribute to your credit history.",
  },
  {
    question: "How is the minimum mutual fund pledge value calculated?",
    answer: "As per standard Loan Against Mutual Funds (LAMF) risk parameters, a 1.5x collateral multiplier (approx. 67% Loan-to-Value) is standard for equity mutual funds to comfortably protect against market volatility.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[var(--bg-page)] dark:bg-[#0C1412] scroll-mt-16 border-t border-[var(--border-subtle)] dark:border-[#1E2D27] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] dark:text-[#B7F34A] bg-[var(--brand-primary-subtle)] dark:bg-[rgba(183,243,74,0.1)] border border-[var(--brand-primary)]/30 dark:border-[#B7F34A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] dark:text-[#F2F5F3] tracking-tight">
            Got Questions About Mutual Fund EMIs?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] dark:text-[#9DA7A2] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about purchasing products with investment-backed financing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={clsx(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)]/40 dark:bg-[#131E1A] dark:border-[#10B981]/40 shadow-premium-xs"
                    : "border-[var(--border-subtle)] dark:border-[#1E2D27] bg-[var(--bg-surface)] dark:bg-[#131E1A] hover:border-[var(--brand-primary)]/30 shadow-premium-xs"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] dark:text-[#F2F5F3]">
                    {item.question}
                  </span>
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0",
                      isOpen
                        ? "rotate-180 bg-[var(--brand-primary)] text-white shadow-xs"
                        : "bg-[var(--bg-surface-subtle)] dark:bg-[#192722] text-[var(--text-secondary)] dark:text-[#9DA7A2]"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[#9DA7A2] leading-relaxed border-t border-[var(--brand-primary)]/10 dark:border-[#1E2D27] pt-3 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
