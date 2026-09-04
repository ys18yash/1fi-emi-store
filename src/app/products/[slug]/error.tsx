"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product detail error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Product Load Error
        </span>

        <h2 className="text-2xl font-extrabold text-gray-950 mt-3">
          Failed to load product details
        </h2>

        <p className="text-xs text-gray-600 mt-2 max-w-sm leading-relaxed">
          We encountered a problem loading the configuration and financing plans for this device.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalog</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
