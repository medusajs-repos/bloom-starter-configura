import { createFileRoute, notFound } from "@tanstack/react-router"
import { getRegion } from "@/lib/data/regions"
import Store from "@/pages/store"
import { listProducts, getBestSellingProductIds } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { sanitize } from "@/lib/utils/sanitize"
import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@/lib/utils/option-value-ids"

export const Route = createFileRoute("/$countryCode/store")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search?.[OPTION_VALUE_QUERY_KEY]
    const normalized =
      Array.isArray(raw)
        ? raw.filter((v): v is string => typeof v === "string")
        : typeof raw === "string"
          ? raw
          : undefined
    const optionValueIds = parseOptionValueIds(
      normalized !== undefined ? { [OPTION_VALUE_QUERY_KEY]: normalized } : {}
    )
    return {
      [OPTION_VALUE_QUERY_KEY]: optionValueIds.length > 0 ? optionValueIds : undefined,
    } as { [OPTION_VALUE_QUERY_KEY]?: string[] }
  },
  loaderDeps: ({ search }) => ({
    optionValueIds: search?.[OPTION_VALUE_QUERY_KEY] ?? [],
  }),
  loader: async ({ params, context, deps }) => {
    const { countryCode } = params
    const { queryClient } = context
    const optionValueIds = deps?.optionValueIds ?? []

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region) {
      throw notFound()
    }

    const { products } = await queryClient.ensureQueryData({
      queryKey: ["products", { region_id: region.id }, optionValueIds],
      queryFn: () => listProducts({
        query_params: {
          limit: 100, // Reduce limit for SSR performance
          order: "-created_at"
        },
        region_id: region.id,
        optionValueIds,
      }),
    })

    // Get best selling product IDs
    const bestSellingIds = await getBestSellingProductIds()

    return sanitize({
      countryCode,
      region,
      products: products as HttpTypes.StoreProduct[],
      bestSellingIds,
      optionValueIds,
    })
  },
  head: ({ loaderData }) => {
    const { region, countryCode } = loaderData || {}
    const regionName = region?.name || countryCode?.toUpperCase()
    const title = `Shop All Products - ${regionName} | Medusa Store`
    const description = `Browse our complete collection of products available in ${regionName}. Free shipping and easy returns.`

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ]
    }
  },
  component: Store,
})