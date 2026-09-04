import { fetchProductsFromApi } from "@/lib/api-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroVisualizer } from "@/components/home/HeroVisualizer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { HowItWorksTimeline } from "@/components/home/HowItWorksTimeline";
import { BenefitsGrid } from "@/components/home/BenefitsGrid";
import { FinancingExplainer } from "@/components/home/FinancingExplainer";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Load dynamic catalog data through the backend REST API
  const products = await fetchProductsFromApi();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-gray-950 selection:bg-purple-100 selection:text-purple-900">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION — MINIMAL FINTECH HERO                       */}
        {/* ========================================================= */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Hero Text & Value Proposition (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Eyebrow — Plain small-caps text */}
                <div className="text-[11px] font-semibold tracking-wider uppercase text-gray-500">
                  Loan Against Mutual Funds (LAMF)
                </div>

                {/* Primary Headline — font-black reserved for H1 */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 leading-[1.1]">
                  Power your next device with your investments.
                </h1>

                {/* Subtitle — One line of gray subtext */}
                <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                  Shop flagship smartphones and laptops on 0% No-Cost EMI without selling your mutual fund units.
                </p>

                {/* Solid CTA Button */}
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="#catalog"
                    className="px-6 py-3 rounded-lg bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <span>Explore Flagship Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust Badges — Editorial inline text list with middle dots */}
                <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-600 font-medium">
                  <span>0% No-Cost EMI</span>
                  <span className="text-gray-300">•</span>
                  <span>Zero Capital Gains Tax</span>
                  <span className="text-gray-300">•</span>
                  <span>Digital Lien via CAMS & KFintech</span>
                </div>
              </div>

              {/* Right Column: Interactive Simulation Card (5 Cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroVisualizer />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PRODUCT CATALOG SECTION (`#catalog`)                      */}
        {/* ========================================================= */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6C28D9]">
                Live Storefront
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight mt-1.5">
                Flagship Devices on Mutual Fund EMI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md">
              Choose your device, configure your finish, and select from flexible 3 to 60-month EMI options.
            </p>
          </div>

          <ProductGrid products={products} />
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS TIMELINE SECTION (`#how-it-works`)           */}
        {/* ========================================================= */}
        <HowItWorksTimeline />

        {/* ========================================================= */}
        {/* WEALTH ADVANTAGE & BENEFITS SECTION (`#benefits`)         */}
        {/* ========================================================= */}
        <BenefitsGrid />

        {/* ========================================================= */}
        {/* FINANCING EXPLAINER & DIAGRAM SECTION (`#financing`)       */}
        {/* ========================================================= */}
        <FinancingExplainer />

        {/* ========================================================= */}
        {/* FAQ ACCORDION SECTION (`#faq`)                            */}
        {/* ========================================================= */}
        <FaqAccordion />
      </main>

      <Footer />
    </div>
  );
}
