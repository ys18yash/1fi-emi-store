import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#6C28D9] flex items-center justify-center mb-6">
          <Search className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#6C28D9] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          404 • Device Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-gray-950 mt-4">
          Looking for a specific device?
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-md">
          The product you are looking for might have been moved or is currently unavailable for mutual fund EMI backing.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-bold text-sm transition-all shadow-md"
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
