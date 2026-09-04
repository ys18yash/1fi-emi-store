"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xs border border-[#E3E5E2] text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 border border-rose-100">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100">
          Application Error
        </span>

        <h2 className="text-2xl font-bold text-[#111318] mt-3 tracking-tight">
          Something went wrong
        </h2>

        <p className="text-xs text-[#646A73] mt-2 leading-relaxed">
          {error.message ||
            "An unexpected error occurred while loading this page. Please try again or return to the store catalog."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#087443] hover:bg-[#065B34] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#F7F7F4] hover:bg-gray-200 border border-[#E3E5E2] text-[#111318] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Store Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
