import fs from "fs";
import path from "path";

const targetUrls: Record<string, string> = {
  // iPhone 17 Pro
  "iphone17pro-silver": "https://snapmint.com/p/apple-iphone-17-pro-silver-256-gb-smart-phones-on-emi?srsltid=AfmBOopyGWZ7u-mqRBgenr9PaO4XuqF6g0Xs3YDKUHlelyXQRF3YIP4f",
  "iphone17pro-deepblue": "https://snapmint.com/p/apple-iphone-17-pro-deep-blue-256-gb-smart-phones-on-emi",
  "iphone17pro-orange": "https://snapmint.com/p/apple-iphone-17-pro-cosmic-orange-256-gb-smart-phones-on-emi",

  // Samsung Galaxy S25 Ultra
  "samsung-s25-black": "https://snapmint.com/p/samsung-galaxy-s25-ultra-5g-titanium-black-256-gb-12-gb-ram-new-launches-on-emi?srsltid=AfmBOoqwMol0wyYm9DIuSiasIZNkGYkctywDLLv-nMRc1Qws8SSRH4ir",
  "samsung-s25-silverblue": "https://snapmint.com/p/samsung-galaxy-s25-ultra-5g-titanium-silverblue-256-gb-12-gb-ram-new-launches-on-emi",
  "samsung-s25-whitesilver": "https://snapmint.com/p/samsung-galaxy-s25-ultra-5g-ai-titanium-whitesilver-12gb-ram-256gb-storage-new-launches-on-emi",
  "samsung-s25-gray": "https://snapmint.com/p/samsung-galaxy-s25-ultra-5g-ai-titanium-gray-12gb-ram-256gb-storage-new-launches-on-emi",

  // Google Pixel 10 Pro
  "pixel10-frost": "https://snapmint.com/p/google-pixel-10-frost-256-gb-12-gb-ram-smart-phones-on-emi?srsltid=AfmBOor0P-n1dgwu-TrI16C0oMBKfO-TdHQgIakjdAZdniu22e6n7_Ui",
  "pixel10-indigo": "https://snapmint.com/p/google-pixel-10-indigo-256-gb-12-gb-ram-smart-phones-on-emi",
  "pixel10-lemongrass": "https://snapmint.com/p/google-pixel-10-lemongrass-256-gb-12-gb-ram-smart-phones-on-emi",
  "pixel10-obsidian": "https://snapmint.com/p/google-pixel-10-obsidian-256-gb-12-gb-ram-smart-phones-on-emi",

  // Apple MacBook Pro 14 M4
  "macbook-pro-14": "https://www.amazon.in/Apple-MacBook-Laptop-14%E2%80%91core-20%E2%80%91core/dp/B0DLHTDZVL",
};

async function fetchPageImages(key: string, url: string) {
  console.log(`\n🔍 Fetching images for [${key}]: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      console.error(`❌ HTTP Error ${res.status} for ${url}`);
      return [];
    }

    const html = await res.text();

    // Look for snapmint product asset URLs
    // Example: https://images.snapmint.com/product_assets/images/...
    const snapmintMatches = Array.from(
      new Set(
        Array.from(
          html.matchAll(/https:\/\/images\.snapmint\.com\/product_assets\/images\/[0-9/]+\/(large|original|thumb)\/[^"'\s&?]+/g)
        ).map((m) => m[0].replace("/thumb/", "/large/").replace("/original/", "/large/"))
      )
    );

    // Also look for amazon image URLs if it's Amazon
    const amazonMatches = Array.from(
      new Set(
        Array.from(
          html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_-]+(?:\._[A-Z0-9_,]+_\.jpg|\.jpg)/g)
        ).map((m) => m[0])
      )
    );

    const matches = snapmintMatches.length > 0 ? snapmintMatches : amazonMatches;
    console.log(`✅ Found ${matches.length} image URLs for [${key}]`);
    matches.forEach((imgUrl, i) => console.log(`   ${i + 1}. ${imgUrl}`));

    return matches;
  } catch (err) {
    console.error(`❌ Error fetching ${url}:`, err);
    return [];
  }
}

async function main() {
  const outputDir = path.join(process.cwd(), "public", "images", "products", "real");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results: Record<string, string[]> = {};

  for (const [key, url] of Object.entries(targetUrls)) {
    const images = await fetchPageImages(key, url);
    results[key] = images;
  }

  fs.writeFileSync(
    path.join(process.cwd(), "scripts", "scraped-images.json"),
    JSON.stringify(results, null, 2)
  );

  console.log("\n✨ Image scraping map saved to scripts/scraped-images.json");
}

main();
