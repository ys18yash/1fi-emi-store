import React from "react";
import { Smartphone, CheckCircle2, Lock, Gift } from "lucide-react";

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
    <section id="how-it-works" className="py-20 bg-white scroll-mt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#6C28D9] bg-purple-50 border border-purple-200">
            Frictionless 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
            How investment-backed purchasing works
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
            No long paperwork or branch visits. A 100% digital experience designed for modern mutual fund investors.
          </p>
        </div>

        {/* Desktop Horizontal Connected Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-6 relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-12 right-12 h-px bg-gray-200 -z-0"></div>

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative z-10 flex flex-col items-start p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-shadow group"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#6C28D9] flex items-center justify-center font-semibold group-hover:bg-[#6C28D9] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-gray-300 group-hover:text-[#6C28D9] transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-950 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Stepped Timeline */}
        <div className="lg:hidden space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C28D9] flex items-center justify-center shrink-0 font-semibold">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#6C28D9]">
                      STEP {step.stepNumber}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-950">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
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

