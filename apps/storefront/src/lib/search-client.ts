import {
  createInstantSearchAdapter,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import type { Hit as HitType } from "instantsearch.js"

import { sdk } from "@/lib/utils/sdk"

export const PRODUCT_INDEX_NAME = "product"

/**
 * The currencies the product index holds prices in, one field set each. Keep in
 * sync with `PRICE_CURRENCIES` in the backend's `src/search/helpers/pricing.ts`.
 */
export const SEARCH_PRICE_CURRENCIES = ["usd", "eur", "gbp", "dkk"]

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"
  | "on_sale"

/**
 * The indexed currency to read prices in for a region. A region whose currency
 * the index doesn't hold falls back to the first one, so the listing still
 * shows a price rather than none.
 */
export const indexedCurrency = (currencyCode: string) => {
  const code = currencyCode.toLowerCase()
  return SEARCH_PRICE_CURRENCIES.includes(code)
    ? code
    : SEARCH_PRICE_CURRENCIES[0]
}

export const priceAttribute = (field: PriceField, currencyCode: string) =>
  `${field}_${indexedCurrency(currencyCode)}`

export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  // Range widgets read `facets_stats`, which the adapter only produces for
  // fields listed here. The price fields are declared with a `stats` facet on
  // the index, which is what makes the stats available at all.
  numericAttributes: SEARCH_PRICE_CURRENCIES.flatMap((currency) => [
    `min_price_${currency}`,
    `max_price_${currency}`,
  ]),
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
} as const

/**
 * The price fields are per currency, e.g. `min_price_eur`, so they're read
 * through `priceAttribute` rather than declared one by one.
 */
export type ProductHit = HitType<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
    category?: string[] | null
    labels?: string[] | null
    option_values?: string[] | null
  } & Record<string, unknown>
>

const amount = (value: unknown) => (typeof value === "number" ? value : null)

export const hitPricing = (hit: ProductHit, currencyCode: string) => {
  const min_price = amount(hit[priceAttribute("min_price", currencyCode)])
  const original_price = amount(
    hit[priceAttribute("original_price", currencyCode)]
  )
  const on_sale =
    hit[priceAttribute("on_sale", currencyCode)] === true &&
    original_price !== null &&
    min_price !== null &&
    original_price > min_price

  return {
    currency_code: indexedCurrency(currencyCode),
    min_price,
    max_price: amount(hit[priceAttribute("max_price", currencyCode)]),
    original_price,
    on_sale,
  }
}
