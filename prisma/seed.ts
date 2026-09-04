import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding 1Fi Store database...");

  // Clean existing data
  await prisma.productEmiPlan.deleteMany();
  await prisma.variantImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.emiPlan.deleteMany();

  // 1. Seed Categories
  const catSmartphones = await prisma.category.create({
    data: {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest flagship smartphones available on zero-cost mutual fund EMIs.",
    },
  });

  const catLaptops = await prisma.category.create({
    data: {
      name: "Laptops & Computing",
      slug: "laptops",
      description: "High performance laptops and creator workstations.",
    },
  });

  // 2. Seed Master EMI Plans
  const standardPlans = [
    { tenureMonths: 3, annualInterestRate: 0.0, isNoCost: true, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 1 },
    { tenureMonths: 6, annualInterestRate: 0.0, isNoCost: true, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 2 },
    { tenureMonths: 12, annualInterestRate: 0.0, isNoCost: true, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 3 },
    { tenureMonths: 24, annualInterestRate: 0.0, isNoCost: true, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 4 },
    { tenureMonths: 36, annualInterestRate: 10.5, isNoCost: false, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 5 },
    { tenureMonths: 48, annualInterestRate: 10.5, isNoCost: false, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 6 },
    { tenureMonths: 60, annualInterestRate: 10.5, isNoCost: false, cashbackAmount: 7500, cashbackDescription: "Additional cashback of ₹7,500", displayOrder: 7 },
  ];

  const createdEmiPlans = [];
  for (const plan of standardPlans) {
    const created = await prisma.emiPlan.create({
      data: plan,
    });
    createdEmiPlans.push(created);
  }

  // -------------------------------------------------------------
  // PRODUCT 1: iPhone 17 Pro (Matches Reference PDF exactly)
  // -------------------------------------------------------------
  const iphone17Pro = await prisma.product.create({
    data: {
      name: "iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      badge: "NEW",
      tagline: "Titanium design. A19 Pro powerhouse. 0% EMI with Mutual Funds.",
      description: "Supercharged by the next-generation A19 Pro chip with advanced GPU architecture and exceptional battery life. Forged in aerospace-grade titanium with the most advanced triple camera system.",
      categoryId: catSmartphones.id,
      isFeatured: true,
      displayOrder: 1,
    },
  });

  const iphoneVariantsData = [
    {
      sku: "IP17P-256-DESERT",
      variantName: "256GB - Desert Titanium",
      colorName: "Desert Titanium",
      colorHex: "#C5A98F",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: true,
      displayOrder: 1,
      image: "/images/products/iphone17pro-desert.svg",
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-256-SILVER",
      variantName: "256GB - Natural Silver",
      colorName: "Natural Silver",
      colorHex: "#E3E4E5",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: false,
      displayOrder: 2,
      image: "/images/products/iphone17pro-silver.svg",
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-256-BLACK",
      variantName: "256GB - Space Black",
      colorName: "Space Black",
      colorHex: "#2E2C2D",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: false,
      displayOrder: 3,
      image: "/images/products/iphone17pro-black.svg",
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-512-DESERT",
      variantName: "512GB - Desert Titanium",
      colorName: "Desert Titanium",
      colorHex: "#C5A98F",
      storage: "512GB",
      mrp: 154900,
      price: 147400,
      isDefault: false,
      displayOrder: 4,
      image: "/images/products/iphone17pro-desert.svg",
      customEmis: { 3: 52026, 6: 26013, 12: 13007, 24: 6503, 36: 4972, 48: 3916, 60: 3288 },
    },
    {
      sku: "IP17P-512-SILVER",
      variantName: "512GB - Natural Silver",
      colorName: "Natural Silver",
      colorHex: "#E3E4E5",
      storage: "512GB",
      mrp: 154900,
      price: 147400,
      isDefault: false,
      displayOrder: 5,
      image: "/images/products/iphone17pro-silver.svg",
      customEmis: { 3: 52026, 6: 26013, 12: 13007, 24: 6503, 36: 4972, 48: 3916, 60: 3288 },
    },
  ];

  for (const vData of iphoneVariantsData) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: iphone17Pro.id,
        sku: vData.sku,
        variantName: vData.variantName,
        colorName: vData.colorName,
        colorHex: vData.colorHex,
        storage: vData.storage,
        mrp: vData.mrp,
        price: vData.price,
        isDefault: vData.isDefault,
        displayOrder: vData.displayOrder,
      },
    });

    // Add Image
    await prisma.variantImage.create({
      data: {
        variantId: variant.id,
        url: vData.image,
        altText: `${iphone17Pro.name} - ${vData.variantName}`,
        isPrimary: true,
      },
    });

    // Associate EMI Plans
    for (const plan of createdEmiPlans) {
      const customEmi = vData.customEmis[plan.tenureMonths as keyof typeof vData.customEmis];
      await prisma.productEmiPlan.create({
        data: {
          variantId: variant.id,
          emiPlanId: plan.id,
          customMonthlyEmi: customEmi,
          displayOrder: plan.displayOrder,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // PRODUCT 2: Samsung Galaxy S25 Ultra
  // -------------------------------------------------------------
  const samsungS25 = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S25 Ultra",
      slug: "samsung-galaxy-s25-ultra",
      brand: "Samsung",
      badge: "BESTSELLER",
      tagline: "Galaxy AI meets Snapdragon 8 Elite with embedded S-Pen.",
      description: "Redefining mobile intelligence with next-gen Snapdragon 8 Elite, 200MP Quad Telephoto camera, vibrant Dynamic AMOLED 2X display, and seamless mutual fund EMI options.",
      categoryId: catSmartphones.id,
      isFeatured: true,
      displayOrder: 2,
    },
  });

  const samsungVariants = [
    {
      sku: "S25U-256-GRAY",
      variantName: "256GB - Titanium Gray",
      colorName: "Titanium Gray",
      colorHex: "#717378",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: true,
      displayOrder: 1,
      image: "/images/products/samsung-s25-gray.svg",
    },
    {
      sku: "S25U-256-BLACK",
      variantName: "256GB - Titanium Black",
      colorName: "Titanium Black",
      colorHex: "#2B2B2B",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: false,
      displayOrder: 2,
      image: "/images/products/samsung-s25-black.svg",
    },
    {
      sku: "S25U-512-GRAY",
      variantName: "512GB - Titanium Gray",
      colorName: "Titanium Gray",
      colorHex: "#717378",
      storage: "512GB",
      mrp: 149999,
      price: 139999,
      isDefault: false,
      displayOrder: 3,
      image: "/images/products/samsung-s25-gray.svg",
    },
  ];

  for (const vData of samsungVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: samsungS25.id,
        sku: vData.sku,
        variantName: vData.variantName,
        colorName: vData.colorName,
        colorHex: vData.colorHex,
        storage: vData.storage,
        mrp: vData.mrp,
        price: vData.price,
        isDefault: vData.isDefault,
        displayOrder: vData.displayOrder,
      },
    });

    await prisma.variantImage.create({
      data: {
        variantId: variant.id,
        url: vData.image,
        altText: `${samsungS25.name} - ${vData.variantName}`,
        isPrimary: true,
      },
    });

    for (const plan of createdEmiPlans) {
      await prisma.productEmiPlan.create({
        data: {
          variantId: variant.id,
          emiPlanId: plan.id,
          displayOrder: plan.displayOrder,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // PRODUCT 3: Google Pixel 10 Pro
  // -------------------------------------------------------------
  const pixel10 = await prisma.product.create({
    data: {
      name: "Google Pixel 10 Pro",
      slug: "google-pixel-10-pro",
      brand: "Google",
      badge: "POPULAR",
      tagline: "Tensor G5 and on-device Gemini AI with pro-level computational photography.",
      description: "Experience the cleanest Android experience with on-device Gemini Pro AI, custom Tensor G5 processor, Super Actua display, and zero-foreclosure mutual fund EMIs.",
      categoryId: catSmartphones.id,
      isFeatured: true,
      displayOrder: 3,
    },
  });

  const pixelVariants = [
    {
      sku: "PIX10-128-OBSIDIAN",
      variantName: "128GB - Obsidian",
      colorName: "Obsidian",
      colorHex: "#202124",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: true,
      displayOrder: 1,
      image: "/images/products/pixel10-obsidian.svg",
    },
    {
      sku: "PIX10-128-PORCELAIN",
      variantName: "128GB - Porcelain",
      colorName: "Porcelain",
      colorHex: "#EAE7DF",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: false,
      displayOrder: 2,
      image: "/images/products/pixel10-porcelain.svg",
    },
    {
      sku: "PIX10-256-OBSIDIAN",
      variantName: "256GB - Obsidian",
      colorName: "Obsidian",
      colorHex: "#202124",
      storage: "256GB",
      mrp: 119999,
      price: 109999,
      isDefault: false,
      displayOrder: 3,
      image: "/images/products/pixel10-obsidian.svg",
    },
  ];

  for (const vData of pixelVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: pixel10.id,
        sku: vData.sku,
        variantName: vData.variantName,
        colorName: vData.colorName,
        colorHex: vData.colorHex,
        storage: vData.storage,
        mrp: vData.mrp,
        price: vData.price,
        isDefault: vData.isDefault,
        displayOrder: vData.displayOrder,
      },
    });

    await prisma.variantImage.create({
      data: {
        variantId: variant.id,
        url: vData.image,
        altText: `${pixel10.name} - ${vData.variantName}`,
        isPrimary: true,
      },
    });

    for (const plan of createdEmiPlans) {
      await prisma.productEmiPlan.create({
        data: {
          variantId: variant.id,
          emiPlanId: plan.id,
          displayOrder: plan.displayOrder,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // PRODUCT 4: Apple MacBook Pro M4 (14-inch)
  // -------------------------------------------------------------
  const macbookPro = await prisma.product.create({
    data: {
      name: "Apple MacBook Pro 14 (M4)",
      slug: "macbook-pro-14-m4",
      brand: "Apple",
      badge: "PRO CHOICE",
      tagline: "Apple M4 chip, Liquid Retina XDR display, up to 24 hours battery life.",
      description: "Engineered for demanding workflows, machine learning, and creative professionals. Shop with no-cost mutual fund EMIs and keep your investment portfolio compounding.",
      categoryId: catLaptops.id,
      isFeatured: true,
      displayOrder: 4,
    },
  });

  const macbookVariants = [
    {
      sku: "MBP14-512-SPACEBLACK",
      variantName: "512GB SSD / 16GB RAM - Space Black",
      colorName: "Space Black",
      colorHex: "#222327",
      storage: "512GB",
      mrp: 179900,
      price: 169900,
      isDefault: true,
      displayOrder: 1,
      image: "/images/products/macbook-spaceblack.svg",
    },
    {
      sku: "MBP14-512-SILVER",
      variantName: "512GB SSD / 16GB RAM - Silver",
      colorName: "Silver",
      colorHex: "#E1E2E4",
      storage: "512GB",
      mrp: 179900,
      price: 169900,
      isDefault: false,
      displayOrder: 2,
      image: "/images/products/macbook-silver.svg",
    },
  ];

  for (const vData of macbookVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: macbookPro.id,
        sku: vData.sku,
        variantName: vData.variantName,
        colorName: vData.colorName,
        colorHex: vData.colorHex,
        storage: vData.storage,
        mrp: vData.mrp,
        price: vData.price,
        isDefault: vData.isDefault,
        displayOrder: vData.displayOrder,
      },
    });

    await prisma.variantImage.create({
      data: {
        variantId: variant.id,
        url: vData.image,
        altText: `${macbookPro.name} - ${vData.variantName}`,
        isPrimary: true,
      },
    });

    for (const plan of createdEmiPlans) {
      await prisma.productEmiPlan.create({
        data: {
          variantId: variant.id,
          emiPlanId: plan.id,
          displayOrder: plan.displayOrder,
        },
      });
    }
  }

  console.log("✅ Successfully seeded 4 products, 13 variants, and comprehensive EMI plans!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
