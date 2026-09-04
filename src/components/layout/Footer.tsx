import Link from "next/link";
import { ShieldCheck, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Positioning (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6C28D9] flex items-center justify-center text-white font-semibold text-sm">
                1F
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                1Fi <span className="text-purple-400 font-normal">Store</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              India&apos;s modern investment-backed purchasing platform. Configure your favorite flagship devices with transparent 0% and low-interest EMI plans without redeeming your mutual funds.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-purple-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Digital Lien Marking via CAMS, KFintech & MFCentral</span>
            </div>
          </div>

          {/* Col 2: Flagship Devices (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Flagship Devices
            </h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/products/iphone-17-pro" className="hover:text-purple-300 transition-colors">
                  Apple iPhone 17 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/samsung-galaxy-s25-ultra" className="hover:text-purple-300 transition-colors">
                  Samsung Galaxy S25 Ultra
                </Link>
              </li>
              <li>
                <Link href="/products/google-pixel-10-pro" className="hover:text-purple-300 transition-colors">
                  Google Pixel 10 Pro
                </Link>
              </li>
              <li>
                <Link href="/products/macbook-pro-14-m4" className="hover:text-purple-300 transition-colors">
                  Apple MacBook Pro 14 (M4)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Platform Links & Developer APIs (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation & APIs
            </h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/#catalog" className="hover:text-purple-300 transition-colors">
                  Device Catalog & Filters
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-purple-300 transition-colors">
                  4-Step LAMF Process
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-purple-300 transition-colors">
                  Wealth Preservation Model
                </Link>
              </li>
              <li>
                <Link href="/api/products" className="font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  GET /api/products
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="font-mono text-purple-400 hover:text-purple-300 transition-colors">
                  GET /api/health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} 1Fi SDE1 Assignment. All mutual fund trademarks belong to their respective AMCs.
          </p>

          <a
            href="#"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

