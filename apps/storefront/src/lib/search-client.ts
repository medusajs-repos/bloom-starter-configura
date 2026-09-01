import {
  createInstantSearchAdapter,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import type { Hit as HitType } from "instantsearch.js"

import { sdk } from "@/lib/utils/sdk"

export const PRODUCT_INDEX_NAME = "product"

export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  numericAttributes: ["min_price"],
  additionalSearchParameters: {
    search_options: {
      count: "exact",
    },
  },
})

export const SEARCH_FACETS = {
  category: "category",
  labels: "labels",
  optionValues: "option_values",
  onSale: "on_sale",
  minPrice: "min_price",
} as const

export type ProductHit = HitType<{
  title: string | null
  handle: string | null
  thumbnail: string | null
  category?: string[] | null
  labels?: string[] | null
  option_values?: string[] | null
  currency_code?: string | null
  min_price?: number | null
  original_price?: number | null
  on_sale?: boolean | null
  discount_percentage?: number | null
}>
