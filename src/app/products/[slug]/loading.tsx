import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProductLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-gray-200 rounded-md mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/5] rounded-2xl bg-gray-100 border border-gray-200"></div>
            <div className="h-32 rounded-2xl bg-purple-50/50 border border-purple-100"></div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-3/4 bg-gray-200 rounded-lg"></div>
              <div className="h-5 w-1/3 bg-gray-200 rounded-md"></div>
            </div>

            <div className="h-12 w-1/2 bg-gray-200 rounded-lg"></div>

            {/* Storage & Color Skeleton */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="h-4 w-28 bg-gray-200 rounded-md"></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-14 bg-gray-100 rounded-xl"></div>
                <div className="h-14 bg-gray-100 rounded-xl"></div>
                <div className="h-14 bg-gray-100 rounded-xl"></div>
              </div>
            </div>

            {/* EMI Cards Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-5 w-60 bg-gray-200 rounded-md"></div>
              <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
              <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
              <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
              <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>

            <div className="h-14 bg-purple-200 rounded-lg"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

