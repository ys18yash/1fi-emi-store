import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding 1Fi Store database with real product images...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.productSpecification.deleteMany();
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

  // =========================================================================
  // PRODUCT 1: iPhone 17 Pro
  // =========================================================================
  const iphone17Pro = await prisma.product.create({
    data: {
      name: "iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      badge: "NEW LAUNCH",
      tagline: "Titanium design. A19 Pro powerhouse. 0% EMI with Mutual Funds.",
      description: "Supercharged by the next-generation A19 Pro chip with advanced GPU architecture and exceptional battery life. Forged in aerospace-grade titanium with the most advanced triple camera system.",
      categoryId: catSmartphones.id,
      isFeatured: true,
      displayOrder: 1,
    },
  });

  const iphoneSpecs = [
    { category: "Display", name: "Display", value: "6.3-inch Super Retina XDR OLED", displayOrder: 1 },
    { category: "Display", name: "Resolution & Refresh Rate", value: "2622 x 1206 pixels, 120Hz ProMotion Adaptive", displayOrder: 2 },
    { category: "Performance", name: "Processor", value: "Apple A19 Pro (3nm, 6-core CPU & 6-core GPU)", displayOrder: 3 },
    { category: "Performance", name: "RAM", value: "12 GB Unified Memory", displayOrder: 4 },
    { category: "Camera", name: "Rear Camera", value: "48MP Main (f/1.78) + 48MP Ultra Wide (f/2.2) + 48MP 5x Telephoto", displayOrder: 5 },
    { category: "Camera", name: "Front Camera", value: "24MP TrueDepth with Autofocus (f/1.9)", displayOrder: 6 },
    { category: "Battery & Power", name: "Battery", value: "Up to 29 hours video playback with MagSafe Fast Wireless Charging", displayOrder: 7 },
    { category: "General", name: "Operating System", value: "iOS 19 with Apple Intelligence", displayOrder: 8 },
    { category: "General", name: "Connectivity", value: "5G, Wi-Fi 7 (802.11be), Bluetooth 5.4, Thread, USB-C (USB 3 10Gbps)", displayOrder: 9 },
    { category: "General", name: "SIM Configuration", value: "Dual SIM (Nano-SIM and eSIM)", displayOrder: 10 },
    { category: "General", name: "Warranty", value: "1 Year Official Apple Manufacturer Warranty", displayOrder: 11 },
    { category: "General", name: "What's in the Box", value: "iPhone 17 Pro, USB-C Charge Cable (1m), Documentation", displayOrder: 12 },
  ];

  for (const s of iphoneSpecs) {
    await prisma.productSpecification.create({
      data: {
        productId: iphone17Pro.id,
        category: s.category,
        name: s.name,
        value: s.value,
        displayOrder: s.displayOrder,
      },
    });
  }

  // Real Image Collections for iPhone 17 Pro
  const iphoneSilverImages = [
    "/images/products/real/iphone17pro-silver/image-1.jpg",
    "/images/products/real/iphone17pro-silver/image-2.jpg",
    "/images/products/real/iphone17pro-silver/image-3.jpg",
    "/images/products/real/iphone17pro-silver/image-4.jpg",
    "/images/products/real/iphone17pro-silver/image-5.jpg",
    "/images/products/real/iphone17pro-silver/image-6.jpg",
    "/images/products/real/iphone17pro-silver/image-7.jpg",
    "/images/products/real/iphone17pro-silver/image-8.jpg",
  ];

  const iphoneDeepBlueImages = [
    "/images/products/real/iphone17pro-deepblue/image-1.jpg",
    "/images/products/real/iphone17pro-deepblue/image-2.jpg",
    "/images/products/real/iphone17pro-deepblue/image-3.jpg",
    "/images/products/real/iphone17pro-deepblue/image-4.jpg",
    "/images/products/real/iphone17pro-deepblue/image-5.jpg",
    "/images/products/real/iphone17pro-deepblue/image-6.jpg",
    "/images/products/real/iphone17pro-deepblue/image-7.jpg",
    "/images/products/real/iphone17pro-deepblue/image-8.jpg",
    "/images/products/real/iphone17pro-deepblue/image-9.jpg",
  ];

  const iphoneOrangeImages = [
    "/images/products/real/iphone17pro-orange/image-1.jpg",
    "/images/products/real/iphone17pro-orange/image-2.jpg",
    "/images/products/real/iphone17pro-orange/image-3.jpg",
    "/images/products/real/iphone17pro-orange/image-4.jpg",
    "/images/products/real/iphone17pro-orange/image-5.jpg",
    "/images/products/real/iphone17pro-orange/image-6.jpg",
    "/images/products/real/iphone17pro-orange/image-7.jpg",
    "/images/products/real/iphone17pro-orange/image-8.jpg",
  ];

  const iphoneVariantsData = [
    {
      sku: "IP17P-256-SILVER",
      variantName: "256GB - Silver",
      colorName: "Silver",
      colorHex: "#E3E4E5",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: true,
      displayOrder: 1,
      images: iphoneSilverImages,
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-256-DEEPBLUE",
      variantName: "256GB - Deep Blue",
      colorName: "Deep Blue",
      colorHex: "#1C2D42",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: false,
      displayOrder: 2,
      images: iphoneDeepBlueImages,
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-256-ORANGE",
      variantName: "256GB - Cosmic Orange",
      colorName: "Cosmic Orange",
      colorHex: "#D45B28",
      storage: "256GB",
      mrp: 134900,
      price: 127400,
      isDefault: false,
      displayOrder: 3,
      images: iphoneOrangeImages,
      customEmis: { 3: 44967, 6: 22483, 12: 11242, 24: 5621, 36: 4297, 48: 3385, 60: 2842 },
    },
    {
      sku: "IP17P-512-SILVER",
      variantName: "512GB - Silver",
      colorName: "Silver",
      colorHex: "#E3E4E5",
      storage: "512GB",
      mrp: 154900,
      price: 147400,
      isDefault: false,
      displayOrder: 4,
      images: iphoneSilverImages,
      customEmis: { 3: 52026, 6: 26013, 12: 13007, 24: 6503, 36: 4972, 48: 3916, 60: 3288 },
    },
    {
      sku: "IP17P-512-DEEPBLUE",
      variantName: "512GB - Deep Blue",
      colorName: "Deep Blue",
      colorHex: "#1C2D42",
      storage: "512GB",
      mrp: 154900,
      price: 147400,
      isDefault: false,
      displayOrder: 5,
      images: iphoneDeepBlueImages,
      customEmis: { 3: 52026, 6: 26013, 12: 13007, 24: 6503, 36: 4972, 48: 3916, 60: 3288 },
    },
    {
      sku: "IP17P-512-ORANGE",
      variantName: "512GB - Cosmic Orange",
      colorName: "Cosmic Orange",
      colorHex: "#D45B28",
      storage: "512GB",
      mrp: 154900,
      price: 147400,
      isDefault: false,
      displayOrder: 6,
      images: iphoneOrangeImages,
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

    for (let i = 0; i < vData.images.length; i++) {
      await prisma.variantImage.create({
        data: {
          variantId: variant.id,
          url: vData.images[i],
          altText: `${iphone17Pro.name} ${vData.variantName} - View ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i + 1,
        },
      });
    }

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

  // =========================================================================
  // PRODUCT 2: Samsung Galaxy S25 Ultra
  // =========================================================================
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

  const samsungSpecs = [
    { category: "Display", name: "Display", value: "6.8-inch Dynamic AMOLED 2X, Corning Gorilla Armor 2", displayOrder: 1 },
    { category: "Display", name: "Resolution & Refresh Rate", value: "3120 x 1440 (Quad HD+), 1-120Hz Adaptive Refresh Rate", displayOrder: 2 },
    { category: "Performance", name: "Processor", value: "Qualcomm Snapdragon 8 Elite for Galaxy (3nm)", displayOrder: 3 },
    { category: "Performance", name: "RAM", value: "12 GB LPDDR5X", displayOrder: 4 },
    { category: "Camera", name: "Rear Camera", value: "200MP Main (f/1.7 OIS) + 50MP 5x Periscope + 50MP 3x Telephoto + 50MP Ultra-Wide", displayOrder: 5 },
    { category: "Camera", name: "Front Camera", value: "12MP Dual Pixel AF (f/2.2)", displayOrder: 6 },
    { category: "Battery & Power", name: "Battery", value: "5,000 mAh with 45W Fast Wired & 15W Wireless PowerShare", displayOrder: 7 },
    { category: "General", name: "Operating System", value: "Android 15 with One UI 7.0 (7 Years OS & Security Updates)", displayOrder: 8 },
    { category: "General", name: "Connectivity", value: "5G SA/NSA, Wi-Fi 7, Bluetooth 5.4, UWB, NFC, USB Type-C 3.2", displayOrder: 9 },
    { category: "General", name: "SIM Configuration", value: "Dual SIM (Nano-SIM + eSIM)", displayOrder: 10 },
    { category: "General", name: "Warranty", value: "1 Year Samsung India Brand Warranty", displayOrder: 11 },
    { category: "General", name: "What's in the Box", value: "Samsung Galaxy S25 Ultra, Built-in S-Pen, USB-C Cable, Ejection Pin", displayOrder: 12 },
  ];

  for (const s of samsungSpecs) {
    await prisma.productSpecification.create({
      data: {
        productId: samsungS25.id,
        category: s.category,
        name: s.name,
        value: s.value,
        displayOrder: s.displayOrder,
      },
    });
  }

  // Real Image Collections for Samsung Galaxy S25 Ultra
  const samsungBlackImages = [
    "/images/products/real/samsung-s25-black/image-1.jpg",
    "/images/products/real/samsung-s25-black/image-2.jpg",
    "/images/products/real/samsung-s25-black/image-3.jpg",
    "/images/products/real/samsung-s25-black/image-4.jpg",
    "/images/products/real/samsung-s25-black/image-5.jpg",
    "/images/products/real/samsung-s25-black/image-6.jpg",
    "/images/products/real/samsung-s25-black/image-7.jpg",
    "/images/products/real/samsung-s25-black/image-8.jpg",
  ];

  const samsungSilverBlueImages = [
    "/images/products/real/samsung-s25-silverblue/image-1.jpg",
    "/images/products/real/samsung-s25-silverblue/image-2.jpg",
    "/images/products/real/samsung-s25-silverblue/image-3.jpg",
    "/images/products/real/samsung-s25-silverblue/image-4.jpg",
    "/images/products/real/samsung-s25-silverblue/image-5.jpg",
    "/images/products/real/samsung-s25-silverblue/image-6.jpg",
    "/images/products/real/samsung-s25-silverblue/image-7.jpg",
    "/images/products/real/samsung-s25-silverblue/image-8.jpg",
    "/images/products/real/samsung-s25-silverblue/image-9.jpg",
  ];

  const samsungWhiteSilverImages = [
    "/images/products/real/samsung-s25-whitesilver/image-1.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-2.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-3.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-4.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-5.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-6.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-7.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-8.jpg",
    "/images/products/real/samsung-s25-whitesilver/image-9.jpg",
  ];

  const samsungGrayImages = [
    "/images/products/real/samsung-s25-gray/image-1.jpg",
    "/images/products/real/samsung-s25-gray/image-2.jpg",
    "/images/products/real/samsung-s25-gray/image-3.jpg",
    "/images/products/real/samsung-s25-gray/image-4.jpg",
    "/images/products/real/samsung-s25-gray/image-5.jpg",
    "/images/products/real/samsung-s25-gray/image-6.jpg",
    "/images/products/real/samsung-s25-gray/image-7.jpg",
    "/images/products/real/samsung-s25-gray/image-8.jpg",
  ];

  const samsungVariants = [
    {
      sku: "S25U-256-BLACK",
      variantName: "256GB - Titanium Black",
      colorName: "Titanium Black",
      colorHex: "#2B2B2B",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: true,
      displayOrder: 1,
      images: samsungBlackImages,
    },
    {
      sku: "S25U-256-SILVERBLUE",
      variantName: "256GB - Titanium Silver Blue",
      colorName: "Titanium Silver Blue",
      colorHex: "#8CA2B5",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: false,
      displayOrder: 2,
      images: samsungSilverBlueImages,
    },
    {
      sku: "S25U-256-WHITESILVER",
      variantName: "256GB - Titanium White Silver",
      colorName: "Titanium White Silver",
      colorHex: "#E4E5E8",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: false,
      displayOrder: 3,
      images: samsungWhiteSilverImages,
    },
    {
      sku: "S25U-256-GRAY",
      variantName: "256GB - Titanium Gray",
      colorName: "Titanium Gray",
      colorHex: "#717378",
      storage: "256GB",
      mrp: 139999,
      price: 129999,
      isDefault: false,
      displayOrder: 4,
      images: samsungGrayImages,
    },
    {
      sku: "S25U-512-BLACK",
      variantName: "512GB - Titanium Black",
      colorName: "Titanium Black",
      colorHex: "#2B2B2B",
      storage: "512GB",
      mrp: 149999,
      price: 139999,
      isDefault: false,
      displayOrder: 5,
      images: samsungBlackImages,
    },
    {
      sku: "S25U-512-SILVERBLUE",
      variantName: "512GB - Titanium Silver Blue",
      colorName: "Titanium Silver Blue",
      colorHex: "#8CA2B5",
      storage: "512GB",
      mrp: 149999,
      price: 139999,
      isDefault: false,
      displayOrder: 6,
      images: samsungSilverBlueImages,
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

    for (let i = 0; i < vData.images.length; i++) {
      await prisma.variantImage.create({
        data: {
          variantId: variant.id,
          url: vData.images[i],
          altText: `${samsungS25.name} ${vData.variantName} - Angle ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i + 1,
        },
      });
    }

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

  // =========================================================================
  // PRODUCT 3: Google Pixel 10 Pro
  // =========================================================================
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

  const pixelSpecs = [
    { category: "Display", name: "Display", value: "6.3-inch Super Actua LTPO OLED (3000 nits peak)", displayOrder: 1 },
    { category: "Display", name: "Resolution & Refresh Rate", value: "2856 x 1280 pixels, 1-120Hz Smooth Display", displayOrder: 2 },
    { category: "Performance", name: "Processor", value: "Google Tensor G5 with Titan M2 Security Chip", displayOrder: 3 },
    { category: "Performance", name: "RAM", value: "16 GB LPDDR5X", displayOrder: 4 },
    { category: "Camera", name: "Rear Camera", value: "50MP Octa PD Main (f/1.68) + 48MP Quad PD Ultrawide + 48MP 5x Telephoto", displayOrder: 5 },
    { category: "Camera", name: "Front Camera", value: "42MP Dual PD Selfie Camera with Autofocus (f/2.2)", displayOrder: 6 },
    { category: "Battery & Power", name: "Battery", value: "4,700 mAh with 30W Fast Charging & Qi-certified Fast Wireless", displayOrder: 7 },
    { category: "General", name: "Operating System", value: "Android 15 with 7 Years of Feature Drops & OS Upgrades", displayOrder: 8 },
    { category: "General", name: "Connectivity", value: "5G Sub-6/mmWave, Wi-Fi 7, Bluetooth 5.4, NFC, Google Cast", displayOrder: 9 },
    { category: "General", name: "SIM Configuration", value: "Dual SIM (Single Nano-SIM and eSIM)", displayOrder: 10 },
    { category: "General", name: "Warranty", value: "1 Year Google India Warranty", displayOrder: 11 },
    { category: "General", name: "What's in the Box", value: "Google Pixel 10 Pro, 1m USB-C Cable, Quick Switch Adapter, SIM Tool", displayOrder: 12 },
  ];

  for (const s of pixelSpecs) {
    await prisma.productSpecification.create({
      data: {
        productId: pixel10.id,
        category: s.category,
        name: s.name,
        value: s.value,
        displayOrder: s.displayOrder,
      },
    });
  }

  // Real Image Collections for Google Pixel 10 Pro
  const pixelFrostImages = [
    "/images/products/real/pixel10-frost/image-1.jpg",
    "/images/products/real/pixel10-frost/image-2.jpg",
    "/images/products/real/pixel10-frost/image-3.jpg",
    "/images/products/real/pixel10-frost/image-4.jpg",
    "/images/products/real/pixel10-frost/image-5.jpg",
    "/images/products/real/pixel10-frost/image-6.jpg",
    "/images/products/real/pixel10-frost/image-7.jpg",
    "/images/products/real/pixel10-frost/image-8.jpg",
    "/images/products/real/pixel10-frost/image-9.jpg",
    "/images/products/real/pixel10-frost/image-10.jpg",
    "/images/products/real/pixel10-frost/image-11.jpg",
  ];

  const pixelIndigoImages = [
    "/images/products/real/pixel10-indigo/image-1.jpg",
    "/images/products/real/pixel10-indigo/image-2.jpg",
    "/images/products/real/pixel10-indigo/image-3.jpg",
    "/images/products/real/pixel10-indigo/image-4.jpg",
    "/images/products/real/pixel10-indigo/image-5.jpg",
    "/images/products/real/pixel10-indigo/image-6.jpg",
    "/images/products/real/pixel10-indigo/image-7.jpg",
    "/images/products/real/pixel10-indigo/image-8.jpg",
    "/images/products/real/pixel10-indigo/image-9.jpg",
    "/images/products/real/pixel10-indigo/image-10.jpg",
    "/images/products/real/pixel10-indigo/image-11.jpg",
    "/images/products/real/pixel10-indigo/image-12.jpg",
  ];

  const pixelLemongrassImages = [
    "/images/products/real/pixel10-lemongrass/image-1.jpg",
    "/images/products/real/pixel10-lemongrass/image-2.jpg",
    "/images/products/real/pixel10-lemongrass/image-3.jpg",
    "/images/products/real/pixel10-lemongrass/image-4.jpg",
    "/images/products/real/pixel10-lemongrass/image-5.jpg",
    "/images/products/real/pixel10-lemongrass/image-6.jpg",
    "/images/products/real/pixel10-lemongrass/image-7.jpg",
    "/images/products/real/pixel10-lemongrass/image-8.jpg",
    "/images/products/real/pixel10-lemongrass/image-9.jpg",
    "/images/products/real/pixel10-lemongrass/image-10.jpg",
    "/images/products/real/pixel10-lemongrass/image-11.jpg",
    "/images/products/real/pixel10-lemongrass/image-12.jpg",
  ];

  const pixelObsidianImages = [
    "/images/products/real/pixel10-obsidian/image-1.jpg",
    "/images/products/real/pixel10-obsidian/image-2.jpg",
    "/images/products/real/pixel10-obsidian/image-3.jpg",
    "/images/products/real/pixel10-obsidian/image-4.jpg",
    "/images/products/real/pixel10-obsidian/image-5.jpg",
    "/images/products/real/pixel10-obsidian/image-6.jpg",
    "/images/products/real/pixel10-obsidian/image-7.jpg",
    "/images/products/real/pixel10-obsidian/image-8.jpg",
    "/images/products/real/pixel10-obsidian/image-9.jpg",
    "/images/products/real/pixel10-obsidian/image-10.jpg",
    "/images/products/real/pixel10-obsidian/image-11.jpg",
  ];

  const pixelVariants = [
    {
      sku: "PIX10-128-FROST",
      variantName: "128GB - Frost",
      colorName: "Frost",
      colorHex: "#E5E9EC",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: true,
      displayOrder: 1,
      images: pixelFrostImages,
    },
    {
      sku: "PIX10-128-INDIGO",
      variantName: "128GB - Indigo",
      colorName: "Indigo",
      colorHex: "#384A68",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: false,
      displayOrder: 2,
      images: pixelIndigoImages,
    },
    {
      sku: "PIX10-128-LEMONGRASS",
      variantName: "128GB - Lemongrass",
      colorName: "Lemongrass",
      colorHex: "#D4DCB2",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: false,
      displayOrder: 3,
      images: pixelLemongrassImages,
    },
    {
      sku: "PIX10-128-OBSIDIAN",
      variantName: "128GB - Obsidian",
      colorName: "Obsidian",
      colorHex: "#202124",
      storage: "128GB",
      mrp: 109999,
      price: 99999,
      isDefault: false,
      displayOrder: 4,
      images: pixelObsidianImages,
    },
    {
      sku: "PIX10-256-FROST",
      variantName: "256GB - Frost",
      colorName: "Frost",
      colorHex: "#E5E9EC",
      storage: "256GB",
      mrp: 119999,
      price: 109999,
      isDefault: false,
      displayOrder: 5,
      images: pixelFrostImages,
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
      displayOrder: 6,
      images: pixelObsidianImages,
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

    for (let i = 0; i < vData.images.length; i++) {
      await prisma.variantImage.create({
        data: {
          variantId: variant.id,
          url: vData.images[i],
          altText: `${pixel10.name} ${vData.variantName} - Angle ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i + 1,
        },
      });
    }

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

  // =========================================================================
  // PRODUCT 4: Apple MacBook Pro 14 (M4)
  // =========================================================================
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

  const macbookSpecs = [
    { category: "Display", name: "Display", value: "14.2-inch Liquid Retina XDR Display (1600 nits peak HDR)", displayOrder: 1 },
    { category: "Display", name: "Resolution & Refresh Rate", value: "3024 x 1964 native resolution, 120Hz ProMotion Technology", displayOrder: 2 },
    { category: "Performance", name: "Processor", value: "Apple M4 Chip (10-core CPU, 10-core GPU, 16-core Neural Engine)", displayOrder: 3 },
    { category: "Performance", name: "RAM", value: "16 GB Unified Memory (Configurable up to 32GB)", displayOrder: 4 },
    { category: "Camera", name: "Camera", value: "12MP Center Stage Camera with 1080p HD video & Desk View", displayOrder: 5 },
    { category: "Battery & Power", name: "Battery", value: "72.4Wh Lithium-polymer battery with up to 24 hours battery life", displayOrder: 6 },
    { category: "General", name: "Operating System", value: "macOS Sequoia", displayOrder: 7 },
    { category: "General", name: "Connectivity", value: "3x Thunderbolt 4 (USB-C), HDMI port, SDXC card slot, MagSafe 3, 3.5mm Headphone Jack", displayOrder: 8 },
    { category: "General", name: "Warranty", value: "1 Year Official Apple Manufacturer Warranty", displayOrder: 9 },
    { category: "General", name: "What's in the Box", value: "14-inch MacBook Pro, 70W USB-C Power Adapter, USB-C to MagSafe 3 Cable (2m)", displayOrder: 10 },
  ];

  for (const s of macbookSpecs) {
    await prisma.productSpecification.create({
      data: {
        productId: macbookPro.id,
        category: s.category,
        name: s.name,
        value: s.value,
        displayOrder: s.displayOrder,
      },
    });
  }

  // Real Amazon High-Res Images for MacBook Pro 14
  const macbookSpaceBlackImages = [
    "/images/products/real/macbook-pro-14/image-4.jpg",
    "/images/products/real/macbook-pro-14/image-5.jpg",
    "/images/products/real/macbook-pro-14/image-6.jpg",
    "/images/products/real/macbook-pro-14/image-7.jpg",
    "/images/products/real/macbook-pro-14/image-8.jpg",
    "/images/products/real/macbook-pro-14/image-9.jpg",
    "/images/products/real/macbook-pro-14/image-18.jpg",
  ];

  const macbookSilverImages = [
    "/images/products/real/macbook-pro-14/image-1.jpg",
    "/images/products/real/macbook-pro-14/image-2.jpg",
    "/images/products/real/macbook-pro-14/image-5.jpg",
    "/images/products/real/macbook-pro-14/image-6.jpg",
    "/images/products/real/macbook-pro-14/image-7.jpg",
    "/images/products/real/macbook-pro-14/image-8.jpg",
    "/images/products/real/macbook-pro-14/image-9.jpg",
  ];

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
      images: macbookSpaceBlackImages,
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
      images: macbookSilverImages,
    },
    {
      sku: "MBP14-1TB-SPACEBLACK",
      variantName: "1TB SSD / 24GB RAM - Space Black",
      colorName: "Space Black",
      colorHex: "#222327",
      storage: "1TB",
      mrp: 199900,
      price: 189900,
      isDefault: false,
      displayOrder: 3,
      images: macbookSpaceBlackImages,
    },
    {
      sku: "MBP14-1TB-SILVER",
      variantName: "1TB SSD / 24GB RAM - Silver",
      colorName: "Silver",
      colorHex: "#E1E2E4",
      storage: "1TB",
      mrp: 199900,
      price: 189900,
      isDefault: false,
      displayOrder: 4,
      images: macbookSilverImages,
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

    for (let i = 0; i < vData.images.length; i++) {
      await prisma.variantImage.create({
        data: {
          variantId: variant.id,
          url: vData.images[i],
          altText: `${macbookPro.name} ${vData.variantName} - Angle ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i + 1,
        },
      });
    }

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

  // =========================================================================
  // SEED DEMO REVIEWS FOR ALL PRODUCTS
  // =========================================================================
  const sampleReviews = [
    // iPhone 17 Pro Reviews
    {
      productId: iphone17Pro.id,
      variantName: "256GB - Silver",
      rating: 5,
      title: "Financing without breaking mutual funds is revolutionary!",
      comment: "Purchased the Silver on the 12-month zero-cost EMI plan. The lien creation on my SBI mutual fund portfolio took less than 2 minutes via CAMS. My investments keep compounding while I get to enjoy the A19 Pro.",
      reviewerName: "Rohan Malhotra",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-15T10:30:00Z"),
    },
    {
      productId: iphone17Pro.id,
      variantName: "256GB - Deep Blue",
      rating: 5,
      title: "Incredible camera and zero interest impact",
      comment: "The 48MP 5x telephoto is super sharp. 1Fi made the entire purchasing process seamless. The ₹7,500 cashback was credited on time.",
      reviewerName: "Pooja Deshmukh",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-20T14:15:00Z"),
    },
    {
      productId: iphone17Pro.id,
      variantName: "512GB - Cosmic Orange",
      rating: 4,
      title: "Top tier performance, slightly warm on intensive games",
      comment: "The titanium finish is very premium in the hand and much lighter. Battery easily lasts more than 24 hours. The mutual fund EMI model is way better than credit card EMIs.",
      reviewerName: "Anand Sundaram",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-28T09:45:00Z"),
    },
    {
      productId: iphone17Pro.id,
      variantName: "256GB - Silver",
      rating: 5,
      title: "Silver looks stunning in person",
      comment: "Smooth 120Hz display and Apple Intelligence features are very responsive. Very happy with the seamless EMI approvals.",
      reviewerName: "Shreya Sen",
      verifiedBuyer: true,
      createdAt: new Date("2026-09-01T16:20:00Z"),
    },

    // Samsung Galaxy S25 Ultra Reviews
    {
      productId: samsungS25.id,
      variantName: "256GB - Titanium Black",
      rating: 5,
      title: "Snapdragon 8 Elite is a beast with Galaxy AI",
      comment: "The anti-reflective screen is the best on any smartphone. The 200MP camera produces stunning detail. 1Fi zero-cost EMI made this luxury phone accessible without disturbing my long-term SIPs.",
      reviewerName: "Vikram Singhania",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-18T11:00:00Z"),
    },
    {
      productId: samsungS25.id,
      variantName: "512GB - Titanium Silver Blue",
      rating: 5,
      title: "S-Pen workflow + 60m EMI plan was effortless",
      comment: "I use this daily for taking notes and signing contracts on the go. The 10.5% reducing balance plan was very competitive and affordable monthly.",
      reviewerName: "Kavita Nair",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-25T13:30:00Z"),
    },

    // Google Pixel 10 Pro Reviews
    {
      productId: pixel10.id,
      variantName: "128GB - Frost",
      rating: 5,
      title: "Best computational photography & on-device Gemini",
      comment: "The camera is unmatched in night mode and portrait edge detection. Clean stock Android with 7 years of promised updates.",
      reviewerName: "Aditya Varma",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-10T15:45:00Z"),
    },
    {
      productId: pixel10.id,
      variantName: "128GB - Lemongrass",
      rating: 4,
      title: "Lemongrass color is gorgeous, fast charging is great",
      comment: "Takes fantastic natural photos. The 1Fi platform approved my mutual fund collateral in under 3 minutes without physical paper documents.",
      reviewerName: "Meera Joshi",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-22T08:10:00Z"),
    },

    // MacBook Pro 14 M4 Reviews
    {
      productId: macbookPro.id,
      variantName: "512GB SSD / 16GB RAM - Space Black",
      rating: 5,
      title: "Unmatched power efficiency for software development",
      comment: "Compiles massive codebases silently and battery lasts a full 2 days of remote work. Backed by my mutual funds with 0% EMI.",
      reviewerName: "Gaurav Mehta",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-12T17:00:00Z"),
    },
    {
      productId: macbookPro.id,
      variantName: "512GB SSD / 16GB RAM - Space Black",
      rating: 5,
      title: "Liquid Retina XDR screen is breathtaking for video editing",
      comment: "Color accuracy and peak HDR brightness are unrivaled. 1Fi's fintech model made this top workstation an easy choice without liquidating my mutual fund units.",
      reviewerName: "Devika Roy",
      verifiedBuyer: true,
      createdAt: new Date("2026-08-29T12:00:00Z"),
    },
  ];

  for (const r of sampleReviews) {
    await prisma.review.create({
      data: r,
    });
  }

  console.log("✅ Successfully seeded 4 products, 22 variants, specs, reviews, and all real multi-image galleries!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
