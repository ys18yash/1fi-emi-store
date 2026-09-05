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
import { ProductSpecifications } from "./ProductSpecifications";
import { InteractiveEmiCalculator } from "./InteractiveEmiCalculator";
import { ProductReviews } from "./ProductReviews";
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

  // Synchronize state with URL search params safely without router reload
  const updateUrlParams = useCallback(
    (variantSku: string, tenureMonths?: number) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      params.set("variant", variantSku);
      if (tenureMonths) {
        params.set("tenure", tenureMonths.toString());
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    },
    []
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
    <div className="site-container py-6 sm:py-10 pb-32 sm:pb-12">
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Store Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)]">{product.category.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-primary)] font-semibold">{product.name}</span>
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
              <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-xs p-5">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-3">
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
        <div className="lg:col-span-7 bg-[var(--bg-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--border-subtle)] shadow-xs space-y-6">
          {/* Top Price Header */}
          <div className="border-b border-[var(--border-subtle)] pb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                {formatINR(selectedVariant.price)}
              </span>
              {selectedVariant.mrp > selectedVariant.price && (
                <span className="text-base text-[var(--text-muted)] line-through font-normal">
                  {formatINR(selectedVariant.mrp)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-[var(--brand-primary)] mt-1 flex items-center gap-1.5">
              <span>●</span> EMI plans backed by mutual funds • Keep earning compound returns
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
                className="w-full py-4 px-6 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed with Selected Plan</span>
                <span className="text-[#C4F36A] text-xs font-semibold">
                  ({formatINR(selectedPlan.monthlyEmi)}/mo)
                </span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-[var(--text-secondary)]">
                Instant digital lien verification via CAMS & KFintech • Zero capital gains tax impact
              </p>
            </div>
          )}

          {/* Product Overview Summary */}
          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-2">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive EMI Calculator Section */}
      <div className="mt-10 sm:mt-14">
        <InteractiveEmiCalculator
          productPrice={selectedVariant.price}
          productName={product.name}
          availablePlans={selectedVariant.emiPlans}
        />
      </div>

      {/* Dynamic Product Specifications Section */}
      <div className="mt-8 sm:mt-10">
        <ProductSpecifications
          specifications={product.specifications}
          selectedVariant={selectedVariant}
          productName={product.name}
        />
      </div>

      {/* Customer Ratings & Reviews Section */}
      <div className="mt-8 sm:mt-10">
        <ProductReviews
          productSlug={product.slug}
          productName={product.name}
          initialSummary={product.reviewSummary}
          selectedVariant={selectedVariant}
        />
      </div>

      {/* Floating Sticky Mobile Bottom Action Bar */}
      {selectedPlan && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] p-4 z-40 shadow-lg flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[var(--text-secondary)] font-semibold block uppercase tracking-wider">
              {selectedPlan.tenureMonths} Months EMI
            </span>
            <span className="text-lg font-black text-[var(--brand-primary)]">
              {formatINR(selectedPlan.monthlyEmi)}
              <span className="text-xs font-normal text-[var(--text-secondary)]">/mo</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-3 px-5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
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

