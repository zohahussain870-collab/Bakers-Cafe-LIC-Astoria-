import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Home Bakery database seeding...");

  // 1. Provision Business Settings (Source of Truth)
  const settings = await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: "Home Bakery",
      address: "House R-1932, Block 17, Gulberg Town, Karachi, 75950, Pakistan",
      phone: "+92 330 2964562",
      whatsappNumber: "923302964562",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Home+Bakery+House+R-1932+Block+17+Gulberg+Town+Karachi",
      googleRating: 5.0,
      ratingCount: 1,
      defaultCurrency: "PKR",
      timezone: "Asia/Karachi",
      isOnlineOrderingEnabled: true,
      isWhatsAppOrderingEnabled: true,
      isTakeoutEnabled: true,
      isDeliveryEnabled: false, // Default Takeout only per business specification
      deliveryFee: 250,
      minOrderValue: 0,
      defaultPrepTime: "Minimum 4 to 6 hours notice for standard bakes; 24 hours for artisan cakes",
      listedAvailability: "Open 24 hours (Order placement & scheduled preparation)",
      isMaintenanceMode: false,
      maintenanceMessage:
        "Home Bakery is temporarily offline for kitchen maintenance. We will be back shortly!",
    },
  });
  console.log("✅ Business settings provisioned");

  // 2. Provision Initial Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@homebakery.pk";
  const adminPassword = process.env.ADMIN_PASSWORD || "HomeBakeryAdmin2026!";
  const adminName = process.env.ADMIN_NAME || "Head Baker";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Administrator account ready: ${admin.email}`);

  // 3. Categories
  const categoriesData = [
    {
      name: "Artisan Cakes",
      slug: "artisan-cakes",
      description: "Layered gourmet cakes handcrafted with rich Belgian chocolate, fresh creams, and premium ingredients.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
    },
    {
      name: "Signature Brownies",
      slug: "signature-brownies",
      description: "Decadently fudgy squares with crackly tops, loaded with dark chocolate and roasted nuts.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
    },
    {
      name: "Gourmet Cupcakes",
      slug: "gourmet-cupcakes",
      description: "Delicate sponge cakes crowned with silky Swiss meringue buttercream and artisanal toppings.",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
    },
    {
      name: "Fresh Pastries & Tarts",
      slug: "pastries-and-tarts",
      description: "Golden flaky pastries, fruit-glazed tarts, and buttery viennoiserie baked fresh to order.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      displayOrder: 4,
    },
    {
      name: "Handcrafted Cookies",
      slug: "handcrafted-cookies",
      description: "Thick, chewy NYC-style cookies with melting chocolate pools and a delicate sprinkle of sea salt.",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
      displayOrder: 5,
    },
    {
      name: "Celebration Gift Boxes",
      slug: "celebration-boxes",
      description: "Curated dessert assortments elegantly packaged for birthdays, anniversaries, and corporate gifting.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      displayOrder: 6,
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log("✅ Categories provisioned (6 categories)");

  // 4. Products with Variants and Photography
  const productsData = [
    {
      name: "Belgian Dark Chocolate Fudge Cake",
      slug: "belgian-dark-chocolate-fudge-cake",
      categorySlug: "artisan-cakes",
      shortDescription: "Ultra-moist chocolate sponge layered with 54% dark Belgian chocolate ganache.",
      description:
        "Our signature creation. Layers of intensely rich, moist chocolate sponge embraced by a velvety smooth Belgian dark chocolate ganache. Perfect for true chocolate lovers seeking deep cocoa notes without overwhelming sweetness. Handcrafted fresh to order in our Gulberg Town home kitchen.",
      basePrice: 2800, // PKR for 1.5 Lb
      prepTime: "24 hours notice",
      availability: "MADE_TO_ORDER",
      stock: 10,
      isStockTracked: false,
      allergens: "Contains wheat gluten, dairy (butter, cream), and eggs. Eggless variant available.",
      ingredients: "Belgian Dark Chocolate, Dutch Process Cocoa, Pure Butter, Farm Fresh Eggs, Heavy Dairy Cream, Madagascar Vanilla, Unbleached Flour, Cane Sugar.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
          alt: "Artisan Belgian Dark Chocolate Fudge Cake with glossy ganache",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80",
          alt: "Slice of decadent chocolate cake showing rich sponge layers",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      variants: [
        { name: "1.5 Lbs (Serves 6-8)", priceAdjustment: 0, isAvailable: true },
        { name: "2.5 Lbs (Serves 10-14)", priceAdjustment: 1600, isAvailable: true },
        { name: "Eggless 1.5 Lbs", priceAdjustment: 200, isAvailable: true },
      ],
    },
    {
      name: "Lotus Biscoff Speculoos Cake",
      slug: "lotus-biscoff-speculoos-cake",
      categorySlug: "artisan-cakes",
      shortDescription: "Spiced sponge infused with crunchy Biscoff spread and caramelized biscuit crumb.",
      description:
        "Delicate vanilla sponge subtly spiced with cinnamon and nutmeg, layered with authentic European Biscoff cookie butter buttercream and finished with a drip of warm speculoos and crushed crunchy biscuits.",
      basePrice: 3200, // PKR
      prepTime: "24 hours notice",
      availability: "MADE_TO_ORDER",
      stock: 8,
      isStockTracked: false,
      allergens: "Contains wheat gluten, soy, dairy. Eggless option available.",
      ingredients: "Lotus Biscoff Spread, Speculoos Biscuits, European Butter, Fresh Cream, Wheat Flour, Cane Sugar, Eggs.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80",
          alt: "Lotus Biscoff layered celebration cake with cookie drip",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "1.5 Lbs (Serves 6-8)", priceAdjustment: 0, isAvailable: true },
        { name: "2.5 Lbs (Serves 10-14)", priceAdjustment: 1800, isAvailable: true },
      ],
    },
    {
      name: "Classic Red Velvet Cream Cheese Cake",
      slug: "classic-red-velvet-cream-cheese-cake",
      categorySlug: "artisan-cakes",
      shortDescription: "Traditional buttermilk cocoa sponge paired with tangy Philadelphia-style cream cheese frosting.",
      description:
        "A timeless southern classic perfected in Karachi. Velvety buttermilk and cocoa crumb tinted a deep ruby, layered with rich, lightly sweetened cream cheese frosting with a hint of fresh lemon zest.",
      basePrice: 3000, // PKR
      prepTime: "24 hours notice",
      availability: "MADE_TO_ORDER",
      stock: 8,
      isStockTracked: false,
      allergens: "Contains wheat gluten, dairy, eggs.",
      ingredients: "Cream Cheese, Pure Butter, Buttermilk, Cocoa Powder, Unbleached Flour, Madagascar Vanilla, Cane Sugar.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1000&q=80",
          alt: "Classic Red Velvet Cake frosted with smooth cream cheese",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "1.5 Lbs (Serves 6-8)", priceAdjustment: 0, isAvailable: true },
        { name: "2.5 Lbs (Serves 10-14)", priceAdjustment: 1700, isAvailable: true },
      ],
    },
    {
      name: "Salted Caramel Fudgy Brownie Box",
      slug: "salted-caramel-fudgy-brownie-box",
      categorySlug: "signature-brownies",
      shortDescription: "Box of 6 intensely fudgy brownies swirled with homemade amber sea salt caramel.",
      description:
        "Crafted with melted 70% dark chocolate and slow-simmered homemade caramel. The crackly crust yields to a dense, gooey center balanced with flaky sea salt crystals.",
      basePrice: 1650, // PKR for box of 6
      prepTime: "4-6 hours notice",
      availability: "AVAILABLE",
      stock: 15,
      isStockTracked: true,
      allergens: "Contains dairy, gluten, eggs.",
      ingredients: "Dark Chocolate 70%, Butter, Brown Sugar, Flaky Sea Salt, Cocoa, Eggs, Flour.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80",
          alt: "Fudgy chocolate brownies with glossy crackly top",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "Box of 6 Squares", priceAdjustment: 0, isAvailable: true },
        { name: "Box of 12 Squares", priceAdjustment: 1400, isAvailable: true },
      ],
    },
    {
      name: "Nutella Walnut Brownie Slab",
      slug: "nutella-walnut-brownie-slab",
      categorySlug: "signature-brownies",
      shortDescription: "Decadent brownie generously studded with toasted walnuts and ribbons of warm Nutella.",
      description:
        "Crisp California walnuts roasted in-house to enhance their nutty aroma, folded into our rich fudge batter and topped with thick dollops of hazelnut cocoa spread.",
      basePrice: 1850, // PKR
      prepTime: "4-6 hours notice",
      availability: "AVAILABLE",
      stock: 12,
      isStockTracked: true,
      allergens: "Contains tree nuts (walnuts, hazelnuts), dairy, gluten, eggs.",
      ingredients: "Nutella Hazelnut Spread, Toasted Walnuts, Dark Chocolate, Butter, Flour, Eggs, Brown Sugar.",
      isFeatured: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1589218436045-ee320057f443?auto=format&fit=crop&w=1000&q=80",
          alt: "Nutella walnut brownie squares on parchment paper",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "Box of 6 Squares", priceAdjustment: 0, isAvailable: true },
        { name: "Box of 12 Squares", priceAdjustment: 1600, isAvailable: true },
      ],
    },
    {
      name: "Artisan Cupcake Collection",
      slug: "artisan-cupcake-collection",
      categorySlug: "gourmet-cupcakes",
      shortDescription: "Assortment of 6 handcrafted cupcakes: Belgian Chocolate, Vanilla Bean, and Pistachio Rose.",
      description:
        "Each cupcake is baked in small batches to maintain a tender crumb. Topped with light-as-air buttercream swirls and delicate edible garnishes. A favorite for gift-giving and high-tea gatherings.",
      basePrice: 1950, // PKR for 6
      prepTime: "6 hours notice",
      availability: "AVAILABLE",
      stock: 10,
      isStockTracked: true,
      allergens: "Contains dairy, gluten, eggs, pistachio nuts.",
      ingredients: "Pure Vanilla Bean, Dutch Cocoa, Pistachio Flour, Butter, Sugar, Eggs, Flour.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=80",
          alt: "Gourmet frosted cupcakes with assorted toppings",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "Box of 6 Assorted", priceAdjustment: 0, isAvailable: true },
        { name: "Box of 12 Assorted", priceAdjustment: 1700, isAvailable: true },
      ],
    },
    {
      name: "NYC Style Chunky Chocolate Chip Cookies",
      slug: "nyc-style-chocolate-chip-cookies",
      categorySlug: "handcrafted-cookies",
      shortDescription: "Extra thick cookies with golden crisp rims and a warm gooey chocolate center.",
      description:
        "Weighed at 120 grams per cookie, these NYC-style treats are chilled for 24 hours to develop deep butterscotch flavor before being baked to golden perfection. Box of 4 jumbo cookies.",
      basePrice: 1400, // PKR
      prepTime: "4-6 hours notice",
      availability: "AVAILABLE",
      stock: 20,
      isStockTracked: true,
      allergens: "Contains dairy, gluten, eggs.",
      ingredients: "Brown Butter, 54% Chocolate Chunks, Unbleached Flour, Molasses Sugar, Farm Eggs, Sea Salt.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80",
          alt: "Thick golden brown chocolate chip cookies stacked",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "Box of 4 Jumbo Cookies", priceAdjustment: 0, isAvailable: true },
        { name: "Box of 8 Jumbo Cookies", priceAdjustment: 1300, isAvailable: true },
      ],
    },
    {
      name: "Grand Celebration Dessert Sampler Box",
      slug: "grand-celebration-dessert-sampler-box",
      categorySlug: "celebration-boxes",
      shortDescription: "Curated gift box featuring 4 fudgy brownies, 4 artisan cupcakes, and 4 chunky cookies.",
      description:
        "The ultimate luxury tasting experience. Beautifully packaged in an artisan presentation box tied with a satin ribbon. Ideal for birthdays, anniversaries, Eid celebrations, and hostess gifts.",
      basePrice: 4200, // PKR
      prepTime: "24 hours notice",
      availability: "MADE_TO_ORDER",
      stock: 5,
      isStockTracked: false,
      allergens: "Contains dairy, gluten, eggs, tree nuts.",
      ingredients: "Premium Belgian Chocolate, Butter, Farm Eggs, Vanilla, Flour, Sugar, Nuts.",
      isFeatured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
          alt: "Curated dessert gift box with assorted pastries and treats",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { name: "Standard Sampler (12 Treats)", priceAdjustment: 0, isAvailable: true },
        { name: "Grand Deluxe (18 Treats)", priceAdjustment: 1800, isAvailable: true },
      ],
    },
  ];

  for (const item of productsData) {
    const categoryId = categoryMap.get(item.categorySlug)!;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        shortDescription: item.shortDescription,
        description: item.description,
        basePrice: item.basePrice,
        prepTime: item.prepTime,
        availability: item.availability,
        stock: item.stock,
        isStockTracked: item.isStockTracked,
        allergens: item.allergens,
        ingredients: item.ingredients,
        isFeatured: item.isFeatured,
        categoryId,
      },
      create: {
        name: item.name,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        basePrice: item.basePrice,
        prepTime: item.prepTime,
        availability: item.availability,
        stock: item.stock,
        isStockTracked: item.isStockTracked,
        allergens: item.allergens,
        ingredients: item.ingredients,
        isFeatured: item.isFeatured,
        categoryId,
      },
    });

    // Clean existing images & variants for clean seed idempotency
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    // Insert Images
    for (const img of item.images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        },
      });
    }

    // Insert Variants
    for (const v of item.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          priceAdjustment: v.priceAdjustment,
          isAvailable: v.isAvailable,
        },
      });
    }
  }
  console.log(`✅ Products provisioned (${productsData.length} artisan products with variants & images)`);

  // 5. Promotional Discount Code
  await prisma.promotion.upsert({
    where: { code: "SWEETWELCOME" },
    update: {},
    create: {
      code: "SWEETWELCOME",
      description: "10% off your first artisan order over PKR 1,500",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 1500,
      maxUses: 100,
      currentUses: 0,
      isActive: true,
    },
  });
  console.log("✅ Welcome promo code ready (SWEETWELCOME)");

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
