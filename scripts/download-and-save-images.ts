import fs from "fs";
import path from "path";

interface ImageManifest {
  [key: string]: Array<{
    localPath: string;
    originalUrl: string;
    width?: number;
    height?: number;
  }>;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.status}`);
      return false;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err);
    return false;
  }
}

async function main() {
  const scrapedPath = path.join(process.cwd(), "scripts", "scraped-images.json");
  if (!fs.existsSync(scrapedPath)) {
    console.error("scraped-images.json not found!");
    return;
  }

  const scraped: Record<string, string[]> = JSON.parse(
    fs.readFileSync(scrapedPath, "utf-8")
  );

  const baseDir = path.join(process.cwd(), "public", "images", "products", "real");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const manifest: ImageManifest = {};

  for (const [key, urls] of Object.entries(scraped)) {
    console.log(`\n📦 Processing [${key}] (${urls.length} potential images)...`);
    const targetDir = path.join(baseDir, key);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Filter and de-duplicate URLs
    let filteredUrls = urls;

    // For macbook/amazon: only take unique high-res images
    if (key === "macbook-pro-14") {
      const highRes = urls.filter(
        (u) =>
          u.includes("._SL1500_.jpg") ||
          (u.endsWith(".jpg") && !u.includes("._") && !u.includes("SS40") && !u.includes("SS75") && !u.includes("SS115"))
      );
      // Get base image ids from amazon url to avoid exact duplicates of same angle
      const seenIds = new Set<string>();
      const uniqueAmazon: string[] = [];
      for (const u of (highRes.length > 0 ? highRes : urls)) {
        const idMatch = u.match(/\/I\/([A-Za-z0-9+_-]+)/);
        const imgId = idMatch ? idMatch[1] : u;
        if (!seenIds.has(imgId)) {
          seenIds.add(imgId);
          uniqueAmazon.push(u);
        }
      }
      filteredUrls = uniqueAmazon;
    } else {
      // For snapmint: unique URLs
      filteredUrls = Array.from(new Set(urls));
    }

    manifest[key] = [];
    let count = 0;

    for (let i = 0; i < filteredUrls.length; i++) {
      const url = filteredUrls[i];
      const filename = `image-${i + 1}.jpg`;
      const destFile = path.join(targetDir, filename);
      const webPath = `/images/products/real/${key}/${filename}`;

      console.log(`   ⏳ Downloading (${i + 1}/${filteredUrls.length}): ${url}`);
      const success = await downloadImage(url, destFile);
      if (success) {
        manifest[key].push({
          localPath: webPath,
          originalUrl: url,
        });
        count++;
      }
    }

    console.log(`✅ Saved ${count} images for [${key}] to ${targetDir}`);
  }

  fs.writeFileSync(
    path.join(baseDir, "image-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n🎉 All product images downloaded and manifest written successfully!");
}

main();
