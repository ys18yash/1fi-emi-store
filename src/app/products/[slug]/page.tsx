import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchProductDetailFromApi } from "@/lib/api-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { Suspense } from "react";
import ProductLoading from "./loading";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: ProductPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await fetchProductDetailFromApi(slug);

  if (!product) {
    return {
      title: "Product Not Found | 1Fi Store",
    };
  }

  const defaultVar =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const lowestEmi = defaultVar?.emiPlans[0]?.monthlyEmi || 0;

  return {
    title: `${product.name} on EMI | 1Fi Mutual Fund Store`,
    description: `Buy ${product.name} on 0% No-Cost EMI starting at ₹${lowestEmi.toLocaleString("en-IN")}/mo backed by your mutual funds without liquidating your investments.`,
    openGraph: {
      title: `${product.name} on 0% Mutual Fund EMI | 1Fi`,
      description: product.tagline || product.description,
      images: [
        {
          url:
            defaultVar?.images[0]?.url ||
            "/images/products/iphone17pro-desert.svg",
        },
      ],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params;

  // Retrieve dynamic product detail through the backend REST API
  const product = await fetchProductDetailFromApi(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F4] text-[#111318]">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<ProductLoading />}>
          <ProductDetailView product={product} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
