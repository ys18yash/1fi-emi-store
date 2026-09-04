"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <section id="faq" className="py-20 bg-white scroll-mt-16 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#6C28D9] bg-purple-50 border border-purple-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
            Got questions about mutual fund EMIs?
          </h2>
          <p className="text-sm text-gray-600 mt-2">
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
                  "rounded-2xl border transition-colors overflow-hidden",
                  isOpen
                    ? "border-[#6C28D9]/40 bg-purple-50/20 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-950">
                    {item.question}
                  </span>
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0",
                      isOpen
                        ? "rotate-180 bg-[#6C28D9] text-white"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-100 pt-3 animate-in fade-in duration-150">
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

