import { getAllProducts, getCatalogFacets, getProductBySlug } from "../src/lib/services/product-service";
import fs from "fs";
import path from "path";

async function exportData() {
  console.log("Exporting static catalog data from database...");
  const products = await getAllProducts();
  const facets = await getCatalogFacets();

  const slugs = ["iphone-17-pro", "samsung-galaxy-s25-ultra", "google-pixel-10-pro", "macbook-pro-14-m4"];
  const productDetails: Record<string, any> = {};

  for (const slug of slugs) {
    const detail = await getProductBySlug(slug);
    if (detail) {
      productDetails[slug] = detail;
    }
  }

  // Ensure public/data directory exists
  const publicDataDir = path.join(process.cwd(), "public", "data");
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  // Write static json files for client fetching and SSR fallbacks
  fs.writeFileSync(
    path.join(publicDataDir, "products.json"),
    JSON.stringify({ success: true, data: products, facets }, null, 2)
  );

  fs.writeFileSync(
    path.join(publicDataDir, "facets.json"),
    JSON.stringify({ success: true, data: facets }, null, 2)
  );

  fs.writeFileSync(
    path.join(process.cwd(), "src", "lib", "static-catalog.json"),
    JSON.stringify({ products, facets, productDetails }, null, 2)
  );

  console.log(`Successfully exported ${products.length} products and facets to public/data/ and src/lib/static-catalog.json`);
}

exportData()
  .catch((err) => {
    console.error("Failed to export static data:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
