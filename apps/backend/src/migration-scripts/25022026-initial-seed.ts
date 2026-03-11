import {
  CreateProductCategoryDTO,
  CreateProductCollectionDTO,
  ExecArgs,
} from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  batchVariantImagesWorkflow,
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkProductsToSalesChannelWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  createDefaultsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initialSeed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // Skip if already seeded
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    pagination: { take: 1 },
  });

  if (existingProducts.length > 0) {
    logger.info("Initial seed already applied, skipping.");
    return;
  }

  logger.info("Seeding defaults...");
  await createDefaultsWorkflow(container).run();

  // ---------------------------------------------------------------------------
  // Store + Sales Channel
  // ---------------------------------------------------------------------------
  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  const defaultChannel = defaultSalesChannel[0]

  function buildPrices(amounts: Record<string, number>) {
    return Object.entries(amounts).map(([currency_code, amount]) => ({
      currency_code,
      amount,
    }));
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "eur", is_tax_inclusive: true },
          { currency_code: "gbp", is_tax_inclusive: true },
          { currency_code: "dkk", is_tax_inclusive: true },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // ---------------------------------------------------------------------------
  // Regions
  // ---------------------------------------------------------------------------
  logger.info("Seeding region data...");
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  });

  if (existingRegions.length === 0) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: false,
            is_tax_inclusive: false,
          },
          {
            name: "Europe",
            currency_code: "eur",
            countries: ["de", "se", "fr", "es", "it"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: true,
            is_tax_inclusive: true,
          },
          {
            name: "United Kingdom",
            currency_code: "gbp",
            countries: ["gb"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: true,
            is_tax_inclusive: true,
          },
          {
            name: "Denmark",
            currency_code: "dkk",
            countries: ["dk"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: true,
            is_tax_inclusive: true,
          },
        ],
      },
    });
  }
  logger.info("Finished seeding regions.");

  // ---------------------------------------------------------------------------
  // Tax regions
  // ---------------------------------------------------------------------------
  logger.info("Seeding tax regions...");
  const taxRates: Record<string, { rate: number; code: string; name: string }> =
    {
      gb: { rate: 20, code: "GB20", name: "UK VAT" },
      de: { rate: 19, code: "DE19", name: "Germany VAT" },
      dk: { rate: 25, code: "DK25", name: "Denmark VAT" },
      se: { rate: 25, code: "SE25", name: "Sweden VAT" },
      fr: { rate: 20, code: "FR20", name: "France VAT" },
      es: { rate: 21, code: "ES21", name: "Spain VAT" },
      it: { rate: 22, code: "IT22", name: "Italy VAT" },
    };

  const taxRegionsToCreate = ["gb", "de", "dk", "se", "fr", "es", "it"];
  await createTaxRegionsWorkflow(container).run({
    input: taxRegionsToCreate.map((country_code) => {
      const taxConfig = taxRates[country_code];
      return {
        country_code,
        provider_id: "tp_system",
        default_tax_rate: {
          rate: taxConfig.rate,
          code: taxConfig.code,
          name: taxConfig.name,
          is_default: true,
        },
      };
    }),
  });
  logger.info("Finished seeding tax regions.");

  // ---------------------------------------------------------------------------
  // Stock location + fulfillment
  // ---------------------------------------------------------------------------
  logger.info("Seeding stock location data...");
  const { data: existingStockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });

  let stockLocation: any;
  if (existingStockLocations.length === 0) {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Main Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "123 Main St",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  } else {
    stockLocation = existingStockLocations[0];
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [{ name: "Default Shipping Profile", type: "default" }],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSets = await fulfillmentModuleService.listFulfillmentSets();

  let fulfillmentSet: any;
  if (fulfillmentSets.length === 0) {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Main Warehouse Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Worldwide",
          geo_zones: ["us", "de", "se", "fr", "es", "it", "gb", "dk"].map(
            (country_code) => ({
              country_code,
              type: "country" as const,
            })
          ),
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
  } else {
    fulfillmentSet = fulfillmentSets[0];
  }

  const { data: existingShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  });

  if (existingShippingOptions.length === 0) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Worldwide Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ships worldwide",
            code: "standard-worldwide",
          },
          prices: [
            { currency_code: "usd", amount: 0 },
            { currency_code: "eur", amount: 0 },
            { currency_code: "gbp", amount: 0 },
            { currency_code: "dkk", amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
  }
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  // ---------------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------------
  logger.info("Creating main chair products...");

  const { result: mainProductsResult } = await createProductsWorkflow(
    container
  ).run({
    input: {
      products: [
        {
          title: "Oslo Executive Office Chair",
          handle: "oslo-executive-office-chair",
          status: "published" as const,
          description:
            "Engineered for the discerning professional, the Oslo Executive Chair combines premium black leather upholstery with a polished chrome base and armrests. The high-density foam cushioning and ergonomic backrest contour provide all-day comfort, while the five-wheel chrome caster base offers smooth, effortless mobility. A commanding presence in any high-end workspace.",
          thumbnail:
            "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_152037_1-01KK9HJ5CZP0S1PKQ1PXMP8D7R.png",
          discountable: true,
          metadata: { is_component: true },
          images: [
            {
              url: "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_152037_1-01KK9HJ5CZP0S1PKQ1PXMP8D7R.png",
            },
            {
              url: "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_160200_1-01KK9JFX9V5PNCE3GSF53YQHFM.png",
            },
          ],
          options: [{ title: "Default option", values: ["Default option value"] }],
          variants: [
            {
              title: "Oslo Wooden Office Chair",
              manage_inventory: false,
              options: { "Default option": "Default option value" },
              prices: buildPrices({ gbp: 899, eur: 1052, usd: 1142 }),
            },
          ],
        },
        {
          title: "Bergen Executive Chair",
          handle: "bergen-executive-chair",
          status: "published" as const,
          description:
            "The Bergen Executive Chair delivers refined comfort through premium woven fabric upholstery and a polished chrome frame. Channelled seat and back panels provide structured support, while the four-star chrome base ensures smooth, stable movement. Fabric-covered armrests complete the cohesive look. A sophisticated choice for the modern executive environment.",
          thumbnail:
            "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_160419_1-01KK9KC7TM0M0HTP02E017MQ2D.png",
          discountable: true,
          images: [
            {
              url: "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_160419_1-01KK9KC7TM0M0HTP02E017MQ2D.png",
            },
            {
              url: "https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/nano_banana_pro_20260309_160819_1-01KK9KCHN823FS9RBNDS37P080.png",
            },
          ],
          options: [{ title: "Default option", values: ["Default option value"] }],
          variants: [
            {
              title: "Bergen Leather Executive Chair",
              manage_inventory: false,
              options: { "Default option": "Default option value" },
              prices: buildPrices({ gbp: 1299, eur: 1520, usd: 1650 }),
            },
          ],
        },
      ],
    },
  });

  const osloProduct = mainProductsResult.find(
    (p) => p.handle === "oslo-executive-office-chair"
  )!;
  const bergenProduct = mainProductsResult.find(
    (p) => p.handle === "bergen-executive-chair"
  )!;

  logger.info(`Created: ${osloProduct.title} (${osloProduct.id})`);
  logger.info(`Created: ${bergenProduct.title} (${bergenProduct.id})`);

  // ---------------------------------------------------------------------------
  // 5. Create Oslo component products (draft, is_component)
  // ---------------------------------------------------------------------------
  logger.info("Creating Oslo component products...");

  const { result: osloComponents } = await createProductsWorkflow(
    container
  ).run({
    input: {
      products: [
        {
          title: "Oslo - Stationary Base",
          handle: "oslo-base-stationary",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 75, eur: 88, usd: 95 }),
            },
          ],
        },
        {
          title: "Oslo - Wheels Base",
          handle: "oslo-base-wheels",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 100, eur: 117, usd: 127 }),
            },
          ],
        },
        {
          title: "Oslo - Brushed Metal Finish",
          handle: "oslo-finish-brushed",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 50, eur: 59, usd: 64 }),
            },
          ],
        },
        {
          title: "Oslo - Chrome Finish",
          handle: "oslo-finish-chrome",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 75, eur: 88, usd: 95 }),
            },
          ],
        },
        {
          title: "Oslo - Black Leather",
          handle: "oslo-leather-black",
          status: "draft" as const,
          description: "Black leather upholstery component for the Oslo Executive Office Chair",
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 100, eur: 117, usd: 127 }),
            },
          ],
        },
        {
          title: "Oslo - Brown Leather",
          handle: "oslo-leather-brown",
          status: "draft" as const,
          description: "Brown leather upholstery component for the Oslo Executive Office Chair",
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 150, eur: 176, usd: 191 }),
            },
          ],
        },
        {
          title: "Oslo - Without Armrests",
          handle: "oslo-no-armrests",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 0, eur: 0, usd: 0 }),
            },
          ],
        },
        {
          title: "Oslo - With Armrests",
          handle: "oslo-with-armrests",
          status: "draft" as const,
          discountable: false,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 125, eur: 146, usd: 159 }),
            },
          ],
        },
      ],
    },
  });

  const osloComponentByHandle: Record<string, string> = {};
  for (const p of osloComponents) {
    osloComponentByHandle[p.handle] = p.id;
  }
  logger.info(`Created ${osloComponents.length} Oslo component products`);

  // ---------------------------------------------------------------------------
  // 6. Create Bergen component products (draft, is_component)
  // ---------------------------------------------------------------------------
  logger.info("Creating Bergen component products...");

  const { result: bergenComponents } = await createProductsWorkflow(
    container
  ).run({
    input: {
      products: [
        {
          title: "Bergen - Height-Adjustable Base",
          handle: "bergen-height-adjustable-base",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 70, eur: 82, usd: 89 }),
            },
          ],
        },
        {
          title: "Bergen - Executive Armrests",
          handle: "bergen-executive-armrests",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 60, eur: 70, usd: 76 }),
            },
          ],
        },
        {
          title: "Bergen - Ergonomic Lumbar Support",
          handle: "bergen-ergonomic-lumbar-support",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 80, eur: 94, usd: 102 }),
            },
          ],
        },
        {
          title: "Bergen - Premium Fabric Upholstery",
          handle: "bergen-premium-fabric-upholstery",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 150, eur: 176, usd: 191 }),
            },
          ],
        },
        {
          title: "Bergen - Performance Fabric Upholstery",
          handle: "bergen-performance-fabric-upholstery",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: true,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 120, eur: 140, usd: 152 }),
            },
          ],
        },
        {
          title: "Bergen - Adjustable Armrests",
          handle: "bergen-adjustable-armrests",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: true,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 75, eur: 88, usd: 95 }),
            },
          ],
        },
        {
          title: "Bergen No Armrests",
          handle: "bergen-no-armrests",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 0, eur: 0, usd: 0 }),
            },
          ],
        },
        {
          title: "Bergen Without Lumbar Support",
          handle: "bergen-without-lumbar-support",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 0, eur: 0, usd: 0 }),
            },
          ],
        },
        {
          title: "Bergen Fixed Base",
          handle: "bergen-fixed-base",
          status: "draft" as const,
          discountable: true,
          metadata: { is_component: true },
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              manage_inventory: false,
              options: { Default: "Default" },
              prices: buildPrices({ gbp: 0, eur: 0, usd: 0 }),
            },
          ],
        },
      ],
    },
  });

  const bergenComponentByHandle: Record<string, string> = {};
  for (const p of bergenComponents) {
    bergenComponentByHandle[p.handle] = p.id;
  }
  logger.info(`Created ${bergenComponents.length} Bergen component products`);

  // ---------------------------------------------------------------------------
  // 7. Link all products to sales channel
  // ---------------------------------------------------------------------------
  logger.info("Linking products to sales channel...");

  const allProductIds = [
    osloProduct.id,
    bergenProduct.id,
    ...osloComponents.map((p) => p.id),
    ...bergenComponents.map((p) => p.id),
  ];

  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: defaultChannel.id,
      add: allProductIds,
    },
  });
  logger.info(`Linked ${allProductIds.length} products to sales channel`);

  // ---------------------------------------------------------------------------
  // 8. Create configurators via the configurator module service
  // ---------------------------------------------------------------------------
  logger.info("Creating configurators...");

  const configuratorService = container.resolve("configurator") as any;

  // --- Oslo Configurator ---
  const osloConfigurator = await configuratorService.createConfigurators({
    name: "Oslo Wooden Office Chair Configurator",
    handle: "oslo-chair-configurator",
    description:
      "Customize your Oslo chair with different bases, finishes, wood colors, and armrest options",
    is_active: true,
    product_id: osloProduct.id,
  });
  logger.info(`Created configurator: ${osloConfigurator.name}`);

  // Oslo steps
  const [
    osloBaseStep,
    osloFinishStep,
    osloLeatherStep,
    osloArmrestsStep,
  ] = await configuratorService.createConfiguratorSteps([
    {
      configurator: { id: osloConfigurator.id },
      title: "Choose Base Type",
      description: "Select between stationary or wheels base",
      order: 1,
    },
    {
      configurator: { id: osloConfigurator.id },
      title: "Choose Base Finish",
      description: "Select the finish for your base",
      order: 2,
    },
    {
      configurator: { id: osloConfigurator.id },
      title: "Choose Leather Color",
      description: "Select your preferred leather color",
      order: 3,
    },
    {
      configurator: { id: osloConfigurator.id },
      title: "Armrests",
      description: "Choose with or without armrests",
      order: 4,
    },
  ]);

  // Oslo options
  await configuratorService.createConfiguratorOptions([
    // Base Type
    {
      step: { id: osloBaseStep.id },
      name: "Stationary Base",
      description: "Classic stationary base for stable seating",
      order: 1,
      price_modifier: 75,
      product_id: osloComponentByHandle["oslo-base-stationary"],
    },
    {
      step: { id: osloBaseStep.id },
      name: "Wheels Base",
      description: "Mobile base with smooth-rolling casters",
      order: 2,
      price_modifier: 100,
      product_id: osloComponentByHandle["oslo-base-wheels"],
    },
    // Base Finish
    {
      step: { id: osloFinishStep.id },
      name: "Brushed Metal",
      description: "Modern brushed metal finish with matte texture",
      order: 1,
      price_modifier: 50,
      product_id: osloComponentByHandle["oslo-finish-brushed"],
    },
    {
      step: { id: osloFinishStep.id },
      name: "Chrome",
      description: "Polished chrome finish for a premium look",
      order: 2,
      price_modifier: 75,
      product_id: osloComponentByHandle["oslo-finish-chrome"],
    },
    // Leather Color
    {
      step: { id: osloLeatherStep.id },
      name: "Black Leather",
      description: "Sleek black leather upholstery for a classic executive look",
      order: 1,
      price_modifier: 100,
      product_id: osloComponentByHandle["oslo-leather-black"],
    },
    {
      step: { id: osloLeatherStep.id },
      name: "Brown Leather",
      description: "Rich brown leather upholstery with warm tones",
      order: 2,
      price_modifier: 150,
      product_id: osloComponentByHandle["oslo-leather-brown"],
    },
    // Armrests
    {
      step: { id: osloArmrestsStep.id },
      name: "Without Armrests",
      description: "Minimalist design without armrests",
      order: 1,
      price_modifier: 0,
      product_id: osloComponentByHandle["oslo-no-armrests"],
    },
    {
      step: { id: osloArmrestsStep.id },
      name: "With Armrests",
      description: "Includes supportive armrests for comfort",
      order: 2,
      price_modifier: 125,
      product_id: osloComponentByHandle["oslo-with-armrests"],
    },
  ]);
  logger.info("Created Oslo configurator steps and options");

  // --- Bergen Configurator ---
  const bergenConfigurator = await configuratorService.createConfigurators({
    name: "Bergen Executive Chair Configurator",
    handle: "bergen-executive-chair",
    description: "Configure your Bergen Executive Chair with premium options",
    is_active: true,
    product_id: bergenProduct.id,
  });
  logger.info(`Created configurator: ${bergenConfigurator.name}`);

  // Bergen steps
  const [
    bergenBaseStep,
    bergenLumbarStep,
    bergenUpholsteryStep,
    bergenArmrestsStep,
  ] = await configuratorService.createConfiguratorSteps([
    {
      configurator: { id: bergenConfigurator.id },
      title: "Choose Base",
      description: "",
      order: 1,
    },
    {
      configurator: { id: bergenConfigurator.id },
      title: "Add Lumbar Support",
      description: "",
      order: 2,
    },
    {
      configurator: { id: bergenConfigurator.id },
      title: "Choose Upholstery",
      description: "",
      order: 3,
    },
    {
      configurator: { id: bergenConfigurator.id },
      title: "Choose Armrests",
      description: "",
      order: 4,
    },
  ]);

  // Bergen options
  await configuratorService.createConfiguratorOptions([
    // Base
    {
      step: { id: bergenBaseStep.id },
      name: "Height-Adjustable Base",
      description: "Pneumatic height adjustment for ergonomic fit",
      order: 0,
      price_modifier: 70,
      product_id: bergenComponentByHandle["bergen-height-adjustable-base"],
    },
    {
      step: { id: bergenBaseStep.id },
      name: "Fixed Base",
      description: "Non-adjustable base at standard height",
      order: 1,
      price_modifier: 0,
      product_id: bergenComponentByHandle["bergen-fixed-base"],
    },
    // Lumbar Support
    {
      step: { id: bergenLumbarStep.id },
      name: "With Lumbar Support",
      description: "Built-in lumbar support for proper posture",
      order: 0,
      price_modifier: 80,
      product_id: bergenComponentByHandle["bergen-ergonomic-lumbar-support"],
    },
    {
      step: { id: bergenLumbarStep.id },
      name: "Without Lumbar Support",
      description: "Standard back without additional lumbar cushion",
      order: 1,
      price_modifier: 0,
      product_id: bergenComponentByHandle["bergen-without-lumbar-support"],
    },
    // Upholstery
    {
      step: { id: bergenUpholsteryStep.id },
      name: "Premium Fabric Upholstery",
      description: "Tightly woven premium fabric for a refined, professional look",
      order: 0,
      price_modifier: 150,
      product_id: bergenComponentByHandle["bergen-premium-fabric-upholstery"],
    },
    {
      step: { id: bergenUpholsteryStep.id },
      name: "Performance Fabric Upholstery",
      description: "Durable, breathable performance fabric for all-day comfort",
      order: 1,
      price_modifier: 120,
      product_id: bergenComponentByHandle["bergen-performance-fabric-upholstery"],
    },
    // Armrests
    {
      step: { id: bergenArmrestsStep.id },
      name: "Executive Armrests",
      description: "Premium padded armrests with fabric upholstery",
      order: 0,
      price_modifier: 60,
      product_id: bergenComponentByHandle["bergen-executive-armrests"],
    },
    {
      step: { id: bergenArmrestsStep.id },
      name: "Adjustable Armrests",
      description: "Fully adjustable armrests for custom positioning",
      order: 1,
      price_modifier: 75,
      product_id: bergenComponentByHandle["bergen-adjustable-armrests"],
    },
    {
      step: { id: bergenArmrestsStep.id },
      name: "No Armrests",
      description: "Sleek armrest-free design for maximum mobility",
      order: 2,
      price_modifier: 0,
      product_id: bergenComponentByHandle["bergen-no-armrests"],
    },
  ]);
  logger.info("Created Bergen configurator steps and options");

  // ---------------------------------------------------------------------------
  // Done
  // ---------------------------------------------------------------------------
  logger.info("=== Migration complete ===");
  logger.info(`Products created: ${allProductIds.length}`);
  logger.info(`Configurators created: 2 (Oslo, Bergen)`);
  logger.info(
    `Oslo configurator steps: 4 (Base Type, Base Finish, Leather Color, Armrests)`
  );
  logger.info(
    `Bergen configurator steps: 4 (Base, Lumbar Support, Upholstery, Armrests)`
  );


  logger.info("Initial seed complete.");
}
