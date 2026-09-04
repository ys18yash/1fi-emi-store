import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F4]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-[#087443]/10 text-[#087443] flex items-center justify-center mb-6 border border-[#087443]/20">
          <Search className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#087443] bg-[#087443]/10 px-3.5 py-1 rounded-full border border-[#087443]/20">
          404 • Device Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-[#111318] mt-4 tracking-tight">
          Looking for a specific device?
        </h1>
        <p className="text-sm text-[#646A73] mt-2 max-w-md leading-relaxed">
          The device you are looking for might have been moved or is currently unavailable for mutual fund pledged EMI.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#087443] hover:bg-[#065B34] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to 1Fi Store Catalog</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

