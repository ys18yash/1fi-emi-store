"use strict";
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  Layers,
  Tag,
  Percent,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Boxes,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const ADMIN_SECRET_KEY = "1fi-admin-secret-2026";

interface AdminStats {
  totalProducts: number;
  totalVariants: number;
  totalCategories: number;
  totalEmiPlans: number;
  totalInventory: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

interface VariantImage {
  id: string;
  variantId: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
  variant?: {
    id: string;
    sku: string;
    variantName: string;
    product?: { id: string; name: string };
  };
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  variantName: string;
  colorName: string;
  colorHex: string;
  storage: string | null;
  mrp: number;
  price: number;
  inventoryCount: number;
  isDefault: boolean;
  displayOrder: number;
  images: VariantImage[];
  product?: { id: string; name: string; slug: string; brand: string };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  tagline: string | null;
  description: string;
  badge: string | null;
  categoryId: string;
  isFeatured: boolean;
  displayOrder: number;
  category: Category;
  variants: ProductVariant[];
  _count?: { variants: number; specifications: number; reviews: number };
}

interface EmiPlan {
  id: string;
  tenureMonths: number;
  annualInterestRate: number;
  isNoCost: boolean;
  cashbackAmount: number;
  cashbackDescription: string | null;
  minPledgeMultiplier: number;
  displayOrder: number;
  _count?: { products: number };
}

type TabType = "products" | "variants" | "categories" | "emi-plans" | "images";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [emiPlans, setEmiPlans] = useState<EmiPlan[]>([]);
  const [images, setImages] = useState<VariantImage[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals state
  const [modalType, setModalType] = useState<
    | "none"
    | "create-product"
    | "edit-product"
    | "create-variant"
    | "edit-variant"
    | "create-category"
    | "edit-category"
    | "create-emi"
    | "edit-emi"
    | "create-image"
    | "delete-confirm"
  >("none");

  const [activeItem, setActiveItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Initialize Auth from local storage / cookie
  useEffect(() => {
    const savedKey =
      localStorage.getItem("1fi_admin_key") ||
      (document.cookie
        .split("; ")
        .find((row) => row.startsWith("1fi_admin_key="))
        ?.split("=")[1] ??
        "");

    if (savedKey === ADMIN_SECRET_KEY) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "x-admin-key": adminKey || ADMIN_SECRET_KEY,
    };
  }, [adminKey]);

  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      const headers = getHeaders();
      const [statsRes, prodRes, catRes, varRes, emiRes, imgRes] =
        await Promise.all([
          fetch("/api/admin/stats", { headers }),
          fetch("/api/admin/products", { headers }),
          fetch("/api/admin/categories", { headers }),
          fetch("/api/admin/variants", { headers }),
          fetch("/api/admin/emi-plans", { headers }),
          fetch("/api/admin/images", { headers }),
        ]);

      if (statsRes.status === 401) {
        setIsAuthenticated(false);
        showToast("error", "Session expired or invalid key");
        return;
      }

      const [statsData, prodData, catData, varData, emiData, imgData] =
        await Promise.all([
          statsRes.json(),
          prodRes.json(),
          catRes.json(),
          varRes.json(),
          emiRes.json(),
          imgRes.json(),
        ]);

      if (statsData.success) setStats(statsData.data);
      if (prodData.success) setProducts(prodData.data);
      if (catData.success) setCategories(catData.data);
      if (varData.success) setVariants(varData.data);
      if (emiData.success) setEmiPlans(emiData.data);
      if (imgData.success) setImages(imgData.data);
    } catch (err: any) {
      showToast("error", err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, loadDashboardData]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (keyInput.trim() === ADMIN_SECRET_KEY) {
      setAdminKey(keyInput.trim());
      setIsAuthenticated(true);
      localStorage.setItem("1fi_admin_key", keyInput.trim());
      document.cookie = `1fi_admin_key=${keyInput.trim()}; path=/; max-age=86400`;
      setAuthError("");
      showToast("success", "Admin authentication verified");
    } else {
      setAuthError("Invalid access token. Use development key or authorized credentials.");
    }
  };

  const handleQuickUnlock = () => {
    setKeyInput(ADMIN_SECRET_KEY);
    setAdminKey(ADMIN_SECRET_KEY);
    setIsAuthenticated(true);
    localStorage.setItem("1fi_admin_key", ADMIN_SECRET_KEY);
    document.cookie = `1fi_admin_key=${ADMIN_SECRET_KEY}; path=/; credentials=same-origin; max-age=86400`;
    showToast("success", "Unlocked with default development admin key");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    localStorage.removeItem("1fi_admin_key");
    document.cookie = "1fi_admin_key=; path=/; max-age=0";
    showToast("success", "Admin session locked");
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleOpenCreateModal = (type: typeof modalType) => {
    setModalType(type);
    setActiveItem(null);
    if (type === "create-product") {
      setFormData({
        name: "",
        slug: "",
        brand: "Apple",
        tagline: "",
        description: "",
        badge: "New Release",
        categoryId: categories[0]?.id || "",
        isFeatured: false,
        displayOrder: 0,
      });
    } else if (type === "create-variant") {
      setFormData({
        productId: products[0]?.id || "",
        sku: `SKU-${Date.now().toString().slice(-4)}`,
        variantName: "128GB Midnight",
        colorName: "Midnight",
        colorHex: "#1E293B",
        storage: "128GB",
        mrp: 79900,
        price: 74900,
        inventoryCount: 25,
        isDefault: false,
        displayOrder: 0,
        imageUrl: "",
      });
    } else if (type === "create-category") {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    } else if (type === "create-emi") {
      setFormData({
        tenureMonths: 6,
        annualInterestRate: 0,
        isNoCost: true,
        cashbackAmount: 1500,
        cashbackDescription: "Flat ₹1,500 Instant Cashback on 6M Tenure",
        minPledgeMultiplier: 1.5,
        displayOrder: 0,
      });
    } else if (type === "create-image") {
      setFormData({
        variantId: variants[0]?.id || "",
        url: "",
        altText: "",
        isPrimary: false,
        displayOrder: 1,
      });
    }
  };

  const handleOpenEditModal = (type: typeof modalType, item: any) => {
    setModalType(type);
    setActiveItem(item);
    setFormData({ ...item });
  };

  const handleOpenDeleteModal = (item: any, type: string) => {
    setActiveItem({ ...item, itemType: type });
    setModalType("delete-confirm");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = getHeaders();

    try {
      if (modalType === "create-product") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create product");
        showToast("success", `Product "${data.data.name}" created successfully`);
      } else if (modalType === "edit-product") {
        const res = await fetch(`/api/admin/products/${activeItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update product");
        showToast("success", `Product "${data.data.name}" updated successfully`);
      } else if (modalType === "create-variant") {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create variant");
        showToast("success", `Variant "${data.data.variantName}" added successfully`);
      } else if (modalType === "edit-variant") {
        const res = await fetch("/api/admin/variants", {
          method: "PUT",
          headers,
          body: JSON.stringify({ id: activeItem.id, ...formData }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update variant");
        showToast("success", `Variant updated successfully`);
      } else if (modalType === "create-category") {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create category");
        showToast("success", `Category "${data.data.name}" created successfully`);
      } else if (modalType === "edit-category") {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers,
          body: JSON.stringify({ id: activeItem.id, ...formData }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update category");
        showToast("success", `Category updated successfully`);
      } else if (modalType === "create-emi") {
        const res = await fetch("/api/admin/emi-plans", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create EMI plan");
        showToast("success", `${data.data.tenureMonths}-Month EMI plan created`);
      } else if (modalType === "edit-emi") {
        const res = await fetch("/api/admin/emi-plans", {
          method: "PUT",
          headers,
          body: JSON.stringify({ id: activeItem.id, ...formData }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update EMI plan");
        showToast("success", `EMI plan updated successfully`);
      } else if (modalType === "create-image") {
        const res = await fetch("/api/admin/images", {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to add image");
        showToast("success", `Image added to variant`);
      }

      setModalType("none");
      await loadDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeItem) return;
    setLoading(true);
    const headers = getHeaders();

    try {
      let endpoint = "";
      if (activeItem.itemType === "product") {
        endpoint = `/api/admin/products/${activeItem.id}`;
        const res = await fetch(endpoint, { method: "DELETE", headers });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete product");
      } else if (activeItem.itemType === "variant") {
        endpoint = `/api/admin/variants?id=${activeItem.id}`;
        const res = await fetch(endpoint, { method: "DELETE", headers });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete variant");
      } else if (activeItem.itemType === "category") {
        endpoint = `/api/admin/categories?id=${activeItem.id}`;
        const res = await fetch(endpoint, { method: "DELETE", headers });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete category");
      } else if (activeItem.itemType === "emi-plan") {
        endpoint = `/api/admin/emi-plans?id=${activeItem.id}`;
        const res = await fetch(endpoint, { method: "DELETE", headers });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete EMI plan");
      } else if (activeItem.itemType === "image") {
        endpoint = `/api/admin/images?id=${activeItem.id}`;
        const res = await fetch(endpoint, { method: "DELETE", headers });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete image");
      }

      showToast("success", `Item deleted successfully`);
      setModalType("none");
      await loadDashboardData();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Featured status directly from table
  const handleToggleFeatured = async (product: Product) => {
    try {
      const headers = getHeaders();
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          "success",
          `Product "${product.name}" is now ${!product.isFeatured ? "Featured" : "Standard"}`
        );
        await loadDashboardData();
      }
    } catch (err: any) {
      showToast("error", "Failed to update status");
    }
  };

  // ==========================================
  // UNLOCKED DASHBOARD VIEW
  // ==========================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#131B2E] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
            <BrandLogo size="lg" badgeText="ADMIN" isLink={false} />
            <span className="text-[11px] text-gray-400 font-medium">Catalog & EMI</span>
          </div>

          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Enter the administrative security key to access catalog management, variant control, and master EMI configuration.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Administrator Access Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-[0.99]"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <button
              onClick={handleQuickUnlock}
              type="button"
              className="text-xs text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Development Mode: Quick Unlock</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Back to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter items based on searchQuery
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVariants = variants.filter(
    (v) =>
      v.variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.product?.name.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/30 text-rose-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="border-b border-gray-800/80 bg-[#10172A]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" badgeText="ADMIN" href="/" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <span>Customer Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors text-xs flex items-center gap-1.5 font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[#131B2E] border border-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Products</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats?.totalProducts ?? products.length}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Catalog items</div>
          </div>

          <div className="bg-[#131B2E] border border-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Variants</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats?.totalVariants ?? variants.length}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">SKU configurations</div>
          </div>

          <div className="bg-[#131B2E] border border-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
              <Tag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats?.totalCategories ?? categories.length}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Taxonomy groups</div>
          </div>

          <div className="bg-[#131B2E] border border-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">EMI Plans</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {stats?.totalEmiPlans ?? emiPlans.length}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Financing options</div>
          </div>

          <div className="bg-[#131B2E] border border-gray-800 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Stock</span>
              <Boxes className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {stats?.totalInventory ?? 0}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Available units</div>
          </div>
        </div>

        {/* Tab Navigation and Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#131B2E] p-1 rounded-xl border border-gray-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "products"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("variants")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "variants"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Variants ({variants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "categories"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("emi-plans")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "emi-plans"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>EMI Plans ({emiPlans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("images")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "images"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images ({images.length})</span>
            </button>
          </div>

          {/* Search & Add New Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131B2E] border border-gray-800 rounded-xl px-3 py-1.5 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            </div>

            {activeTab === "products" && (
              <button
                onClick={() => handleOpenCreateModal("create-product")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === "variants" && (
              <button
                onClick={() => handleOpenCreateModal("create-variant")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            )}

            {activeTab === "categories" && (
              <button
                onClick={() => handleOpenCreateModal("create-category")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === "emi-plans" && (
              <button
                onClick={() => handleOpenCreateModal("create-emi")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add EMI Plan</span>
              </button>
            )}

            {activeTab === "images" && (
              <button
                onClick={() => handleOpenCreateModal("create-image")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-md shadow-purple-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB CONTENT: PRODUCTS */}
        {activeTab === "products" && (
          <div className="bg-[#131B2E] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1524] text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Badge</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3">Variants</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            /{p.slug}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{p.brand}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            {p.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.badge ? (
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-semibold">
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                              p.isFeatured
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-gray-800 text-gray-500 border border-gray-700 hover:text-gray-300"
                            }`}
                          >
                            {p.isFeatured ? "Featured" : "Standard"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {p.variants?.length ?? 0} variants
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                              title="View Customer Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal("edit-product", p)}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-purple-600/30 text-gray-400 hover:text-purple-300 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(p, "product")}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-rose-600/30 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: VARIANTS */}
        {activeTab === "variants" && (
          <div className="bg-[#131B2E] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1524] text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Variant / Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Color</th>
                    <th className="px-4 py-3">Storage</th>
                    <th className="px-4 py-3">Pricing (₹)</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Images</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No variants found.
                      </td>
                    </tr>
                  ) : (
                    filteredVariants.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{v.variantName}</div>
                          <div className="text-[11px] text-purple-400">
                            {v.product?.name || "Unassigned"}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-400">{v.sku}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-600 shadow-xs"
                              style={{ backgroundColor: v.colorHex }}
                            />
                            <span className="text-gray-300">{v.colorName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{v.storage || "N/A"}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">₹{v.price.toLocaleString("en-IN")}</div>
                          <div className="text-[11px] text-gray-500 line-through">
                            ₹{v.mrp.toLocaleString("en-IN")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              v.inventoryCount > 10
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : v.inventoryCount > 0
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {v.inventoryCount} units
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {v.images?.length ?? 0} photos
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal("edit-variant", v)}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-purple-600/30 text-gray-400 hover:text-purple-300 transition-colors"
                              title="Edit Variant"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(v, "variant")}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-rose-600/30 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Delete Variant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="bg-[#131B2E] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1524] text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Category Name</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Products</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                        <td className="px-4 py-3 font-mono text-gray-400">/{c.slug}</td>
                        <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                          {c.description || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            {c._count?.products ?? 0} active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal("edit-category", c)}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-purple-600/30 text-gray-400 hover:text-purple-300 transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(c, "category")}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-rose-600/30 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: EMI PLANS */}
        {activeTab === "emi-plans" && (
          <div className="bg-[#131B2E] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E1524] text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Tenure (Months)</th>
                    <th className="px-4 py-3">Interest Rate</th>
                    <th className="px-4 py-3">No Cost Flag</th>
                    <th className="px-4 py-3">Cashback</th>
                    <th className="px-4 py-3">Min Pledge Multiplier</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {emiPlans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No master EMI plans found.
                      </td>
                    </tr>
                  ) : (
                    emiPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {plan.tenureMonths} Months
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {plan.annualInterestRate === 0
                            ? "0% (Interest Free)"
                            : `${plan.annualInterestRate}% p.a.`}
                        </td>
                        <td className="px-4 py-3">
                          {plan.isNoCost ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                              NO COST EMI
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 text-[10px]">
                              Standard EMI
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {plan.cashbackAmount > 0 ? (
                            <div>
                              <span className="font-semibold text-emerald-400">
                                ₹{plan.cashbackAmount.toLocaleString("en-IN")}
                              </span>
                              {plan.cashbackDescription && (
                                <div className="text-[10px] text-gray-400 truncate max-w-xs">
                                  {plan.cashbackDescription}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {plan.minPledgeMultiplier}x Mutual Fund Value
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal("edit-emi", plan)}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-purple-600/30 text-gray-400 hover:text-purple-300 transition-colors"
                              title="Edit EMI Plan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(plan, "emi-plan")}
                              className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-rose-600/30 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Delete EMI Plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: IMAGES */}
        {activeTab === "images" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-[#131B2E] border border-gray-800 rounded-xl">
                No images configured.
              </div>
            ) : (
              images.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#131B2E] border border-gray-800 rounded-xl overflow-hidden flex flex-col group relative"
                >
                  <div className="aspect-square bg-white/5 relative p-4 flex items-center justify-center">
                    <img
                      src={img.url}
                      alt={img.altText || "Product photo"}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-semibold uppercase tracking-wider shadow">
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between border-t border-gray-800 bg-[#0E1524]">
                    <div>
                      <div className="text-xs font-semibold text-white truncate">
                        {img.variant?.product?.name || "Variant Image"}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {img.variant?.variantName} ({img.variant?.sku})
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-800/60 text-[10px] text-gray-500">
                      <span>Order: #{img.displayOrder}</span>
                      <button
                        onClick={() => handleOpenDeleteModal(img, "image")}
                        className="text-rose-400 hover:text-rose-300 p-1 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ==========================================
          MODALS
      ========================================== */}

      {modalType !== "none" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#131B2E] border border-gray-700 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType("none")}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PRODUCT MODAL */}
            {(modalType === "create-product" || modalType === "edit-product") && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {modalType === "create-product" ? "Create Product" : "Edit Product"}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug:
                            modalType === "create-product"
                              ? e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, "")
                              : formData.slug,
                        })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Slug</label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ""}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Brand</label>
                      <input
                        type="text"
                        required
                        value={formData.brand || ""}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Category</label>
                      <select
                        value={formData.categoryId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, categoryId: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. New Launch"
                        value={formData.badge || ""}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="Short catchphrase"
                      value={formData.tagline || ""}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="rounded border-gray-700 bg-[#0B0F19] text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isFeatured" className="text-gray-300 font-medium">
                      Feature on Homepage & Spotlight
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("none")}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Save Product</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VARIANT MODAL */}
            {(modalType === "create-variant" || modalType === "edit-variant") && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {modalType === "create-variant" ? "Add Variant" : "Edit Variant"}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  {modalType === "create-variant" && (
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Product</label>
                      <select
                        value={formData.productId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, productId: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.brand})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">SKU</label>
                      <input
                        type="text"
                        required
                        value={formData.sku || ""}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Variant Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 256GB Desert Titanium"
                        value={formData.variantName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, variantName: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Color Name</label>
                      <input
                        type="text"
                        required
                        value={formData.colorName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, colorName: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Color Hex</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={formData.colorHex || "#1E293B"}
                          onChange={(e) =>
                            setFormData({ ...formData, colorHex: e.target.value })
                          }
                          className="w-8 h-8 rounded bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          required
                          value={formData.colorHex || "#1E293B"}
                          onChange={(e) =>
                            setFormData({ ...formData, colorHex: e.target.value })
                          }
                          className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-2 py-2 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Storage</label>
                      <input
                        type="text"
                        placeholder="e.g. 256GB"
                        value={formData.storage || ""}
                        onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.price || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number(e.target.value) })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.mrp || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, mrp: Number(e.target.value) })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Inventory</label>
                      <input
                        type="number"
                        required
                        value={formData.inventoryCount || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inventoryCount: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {modalType === "create-variant" && (
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Initial Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.imageUrl || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("none")}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Save Variant</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CATEGORY MODAL */}
            {(modalType === "create-category" || modalType === "edit-category") && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {modalType === "create-category" ? "Create Category" : "Edit Category"}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug:
                            modalType === "create-category"
                              ? e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, "")
                              : formData.slug,
                        })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug || ""}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("none")}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Save Category</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* EMI PLAN MODAL */}
            {(modalType === "create-emi" || modalType === "edit-emi") && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {modalType === "create-emi" ? "Add EMI Plan" : "Edit EMI Plan"}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Tenure (Months)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={formData.tenureMonths || 6}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tenureMonths: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Annual Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={0.1}
                        value={formData.annualInterestRate ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            annualInterestRate: Number(e.target.value),
                            isNoCost: Number(e.target.value) === 0,
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Cashback Amount (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.cashbackAmount || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cashbackAmount: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Min Pledge Multiplier
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        step={0.1}
                        value={formData.minPledgeMultiplier || 1.5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minPledgeMultiplier: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">
                      Cashback Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat ₹1,500 Instant Cashback on 6M Tenure"
                      value={formData.cashbackDescription || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashbackDescription: e.target.value,
                        })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("none")}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Save EMI Plan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* IMAGE MODAL */}
            {modalType === "create-image" && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Add Variant Image</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Target Variant</label>
                    <select
                      value={formData.variantId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, variantId: e.target.value })
                      }
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                    >
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.product?.name} - {v.variantName} ({v.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formData.url || ""}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Alt Text</label>
                      <input
                        type="text"
                        placeholder="Descriptive label"
                        value={formData.altText || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, altText: e.target.value })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Display Order</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.displayOrder || 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayOrder: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={formData.isPrimary || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isPrimary: e.target.checked })
                      }
                      className="rounded border-gray-700 bg-[#0B0F19] text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isPrimary" className="text-gray-300 font-medium">
                      Set as primary showcase image for variant
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModalType("none")}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Save Image</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DELETE CONFIRMATION DIALOG */}
            {modalType === "delete-confirm" && (
              <div>
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Are you sure you want to permanently delete this {activeItem?.itemType}? This action cannot be undone and will immediately affect customer catalog availability.
                </p>

                <div className="flex justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalType("none")}
                    className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Delete Record</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
