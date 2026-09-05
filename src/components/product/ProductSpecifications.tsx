"use strict";
"use client";

import React, { useState, useMemo } from "react";
import { ProductSpecificationDto, ProductVariantDto } from "@/types/product";
import {
  Cpu,
  Smartphone,
  HardDrive,
  BatteryCharging,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface ProductSpecificationsProps {
  specifications: ProductSpecificationDto[];
  selectedVariant: ProductVariantDto;
  productName: string;
}

export function ProductSpecifications({
  specifications,
  selectedVariant,
  productName,
}: ProductSpecificationsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Group specs by category
  const categorizedSpecs = useMemo(() => {
    if (!specifications || specifications.length === 0) return [];

    const categoryMap = new Map<string, ProductSpecificationDto[]>();

    specifications.forEach((spec) => {
      const cat = spec.category?.trim() || "General Specifications";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat)!.push(spec);
    });

    return Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.displayOrder - b.displayOrder),
    }));
  }, [specifications]);

  // Find key specs for quick highlight cards
  const processorSpec = specifications.find((s) =>
    /processor|chipset|chip/i.test(s.name)
  );
  const displaySpec = specifications.find((s) =>
    /display|screen/i.test(s.name)
  );
  const batterySpec = specifications.find((s) =>
    /battery/i.test(s.name)
  );

  return (
    <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] shadow-premium-sm p-6 sm:p-8 space-y-6">
      {/* Header with Title and Toggle for Mobile */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--brand-primary)]" />
            <span>Technical Specifications</span>
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Verified hardware & system specs for {productName}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden flex items-center gap-1 text-xs font-bold text-[var(--brand-primary)] transition-colors p-1"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Collapse" : "View All"}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Dynamic Variant Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Variant Storage (Variant-Level) */}
        <div className="p-3.5 rounded-2xl bg-[var(--brand-primary-subtle)] border border-[var(--brand-primary)]/20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-primary)] mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Storage (Active)</span>
          </div>
          <span className="text-sm sm:text-base font-black text-[var(--text-primary)] block truncate">
            {selectedVariant.storage || selectedVariant.variantName}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5 font-mono">
            SKU: {selectedVariant.sku}
          </span>
        </div>

        {/* Active Variant Color/Finish (Variant-Level) */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1">
            <div
              className="w-3 h-3 rounded-full border border-[var(--border-subtle)] shrink-0"
              style={{ backgroundColor: selectedVariant.colorHex }}
            />
            <span>Finish (Active)</span>
          </div>
          <span className="text-sm sm:text-base font-black text-[var(--text-primary)] block truncate">
            {selectedVariant.colorName}
          </span>
          <span className="text-[10px] text-[var(--brand-primary)] font-bold flex items-center gap-0.5 mt-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> In Stock ({selectedVariant.inventoryCount})
          </span>
        </div>

        {/* Processor (Product-Level) */}
        {processorSpec && (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <Cpu className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>Processor</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] block truncate">
              {processorSpec.value}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Verified silicon</span>
          </div>
        )}

        {/* Display or Battery (Product-Level) */}
        {(displaySpec || batterySpec) && (
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1">
              {displaySpec ? (
                <Smartphone className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              ) : (
                <BatteryCharging className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              )}
              <span>{displaySpec ? "Display" : "Battery"}</span>
            </div>
            <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] block truncate">
              {displaySpec ? displaySpec.value : batterySpec?.value}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Factory specification</span>
          </div>
        )}
      </div>

      {/* Categorized Specifications 2-Column Table */}
      <div
        className={`space-y-6 sm:space-y-8 ${
          isExpanded ? "block" : "hidden sm:block"
        }`}
      >
        {categorizedSpecs.length > 0 ? (
          categorizedSpecs.map((catGroup, idx) => (
            <div key={catGroup.category || idx} className="space-y-2.5">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-1.5">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  {catGroup.category}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-medium">
                  ({catGroup.items.length} specs)
                </span>
              </div>

              {/* Two-Column Specification Key-Value Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                {catGroup.items.map((spec) => {
                  const isStorageField = /storage/i.test(spec.name);
                  const displayValue = isStorageField && selectedVariant.storage
                    ? `${selectedVariant.storage} (Selected Variant)`
                    : spec.value;

                  return (
                    <div
                      key={spec.id}
                      className="flex items-start justify-between py-2 border-b border-[var(--border-subtle)]/40 text-xs sm:text-sm"
                    >
                      <span className="text-[var(--text-secondary)] font-medium pr-4 w-5/12 shrink-0">
                        {spec.name}
                      </span>
                      <span className="text-[var(--text-primary)] font-bold text-right sm:text-left w-7/12 break-words">
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-2xl border border-[var(--border-subtle)]">
            Detailed specifications are being cataloged for this model.
          </div>
        )}

        {/* Transparency Footer Note */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
          <span>
            All specifications are 100% genuine brand manufacturer details verified for warranty support in India.
          </span>
        </div>
      </div>
    </div>
  );
}
