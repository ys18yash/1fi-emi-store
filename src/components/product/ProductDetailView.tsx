"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductDetailDto, ProductVariantDto, EmiPlanDto } from "@/types/product";
import { formatINR } from "@/lib/formatters";
import { ProductGallery } from "./ProductGallery";
import { VariantSelector } from "./VariantSelector";
import { EmiPlanList } from "./EmiPlanList";
import { MfAdvantageCard } from "./MfAdvantageCard";
import { PlanSummaryModal } from "./PlanSummaryModal";
import { ChevronRight, ArrowRight } from "lucide-react";

interface ProductDetailViewProps {
  product: ProductDetailDto;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Find initial variant from URL query param ?variant=<sku> or default
  const initialVariant = useMemo(() => {
    const variantSkuFromUrl = searchParams.get("variant");
    if (variantSkuFromUrl) {
      const found = product.variants.find(
        (v) => v.sku.toLowerCase() === variantSkuFromUrl.toLowerCase()
      );
      if (found) return found;
    }
    return product.variants.find((v) => v.isDefault) || product.variants[0];
  }, [product.variants, searchParams]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDto>(initialVariant);

  // Find initial tenure from URL query param ?tenure=<months> or default 12m
  const initialPlanId = useMemo(() => {
    const tenureFromUrl = searchParams.get("tenure");
    if (tenureFromUrl) {
      const months = parseInt(tenureFromUrl, 10);
      const found = selectedVariant.emiPlans.find((p) => p.tenureMonths === months);
      if (found) return found.id;
    }
    const twelveMonth = selectedVariant.emiPlans.find((p) => p.tenureMonths === 12);
    return twelveMonth ? twelveMonth.id : selectedVariant.emiPlans[0]?.id || "";
  }, [selectedVariant, searchParams]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active selected EMI plan
  const selectedPlan: EmiPlanDto | undefined = useMemo(() => {
    return (
      selectedVariant.emiPlans.find((p) => p.id === selectedPlanId) ||
      selectedVariant.emiPlans[0]
    );
  }, [selectedVariant, selectedPlanId]);

  // Synchronize state with URL search params
  const updateUrlParams = useCallback(
    (variantSku: string, tenureMonths?: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", variantSku);
      if (tenureMonths) {
        params.set("tenure", tenureMonths.toString());
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Variant switch handler
  const handleSelectVariant = (newVariant: ProductVariantDto) => {
    setSelectedVariant(newVariant);

    // Retain matching tenure in new variant if possible
    let newPlanTenure = selectedPlan?.tenureMonths;
    if (selectedPlan) {
      const matchingPlan = newVariant.emiPlans.find(
        (p) => p.tenureMonths === selectedPlan.tenureMonths
      );
      if (matchingPlan) {
        setSelectedPlanId(matchingPlan.id);
        newPlanTenure = matchingPlan.tenureMonths;
      } else if (newVariant.emiPlans.length > 0) {
        setSelectedPlanId(newVariant.emiPlans[0].id);
        newPlanTenure = newVariant.emiPlans[0].tenureMonths;
      }
    }

    updateUrlParams(newVariant.sku, newPlanTenure);
  };

  // EMI Plan switch handler
  const handleSelectPlan = (plan: EmiPlanDto) => {
    setSelectedPlanId(plan.id);
    updateUrlParams(selectedVariant.sku, plan.tenureMonths);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32 sm:pb-12">
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Store Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400">{product.category.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main 2-Column Responsive Configurator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Showcase Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Gallery Stage matching reference left panel */}
            <ProductGallery
              images={selectedVariant.images}
              productName={product.name}
              badge={product.badge}
              storage={selectedVariant.storage}
              colorName={selectedVariant.colorName}
              colorHex={selectedVariant.colorHex}
              variants={product.variants}
              selectedVariantId={selectedVariant.id}
              onSelectVariant={handleSelectVariant}
            />

            {/* Storage Tier Selector (if multiple tiers exist) */}
            {product.variants.some((v) => v.storage !== product.variants[0]?.storage) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2.5">
                  Storage Capacity
                </span>
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={handleSelectVariant}
                />
              </div>
            )}

            {/* Compounding & Collateral Insight Card */}
            <MfAdvantageCard
              price={selectedVariant.price}
              selectedTenureMonths={selectedPlan?.tenureMonths ?? 12}
              requiredMfPledge={selectedPlan?.requiredMfPledge}
              monthlyGrowthEstimated={selectedPlan?.monthlyMutualFundGrowthEstimated}
            />
          </div>
        </div>

        {/* Right Column: Price & EMI Plans List (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {/* Top Price Header */}
          <div className="border-b border-gray-100 pb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                {formatINR(selectedVariant.price)}
              </span>
              {selectedVariant.mrp > selectedVariant.price && (
                <span className="text-base text-gray-400 line-through font-normal">
                  {formatINR(selectedVariant.mrp)}
                </span>
              )}
            </div>
            <p className="text-sm font-normal text-gray-500 mt-1">
              EMI plans backed by mutual funds
            </p>
          </div>

          {/* EMI Plans List */}
          <EmiPlanList
            plans={selectedVariant.emiPlans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={handleSelectPlan}
          />

          {/* CTA & Trust Line */}
          {selectedPlan && (
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-lg bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed with Selected Plan</span>
                <span className="text-purple-200 text-xs font-normal">
                  ({formatINR(selectedPlan.monthlyEmi)}/mo)
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-center text-xs text-gray-500">
                Instant digital lien verification via CAMS & KFintech • Zero capital gains tax impact
              </p>
            </div>
          )}

          {/* Product Overview Accordion */}
          <div className="pt-6 border-t border-gray-100 space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Product Overview & Specifications
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Sticky Mobile Bottom Action Bar */}
      {selectedPlan && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3.5 z-40 shadow-md flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">
              {selectedPlan.tenureMonths} Months EMI
            </span>
            <span className="text-lg font-black text-[#6C28D9]">
              {formatINR(selectedPlan.monthlyEmi)}
              <span className="text-xs font-normal text-gray-500">/mo</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-4 rounded-lg bg-[#6C28D9] hover:bg-[#5B21B6] text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Checkout Summary Modal */}
      {selectedPlan && (
        <PlanSummaryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={product.name}
          variant={selectedVariant}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}

