import { PRODUCT_INDEX_NAME, priceAttribute } from "@/lib/search-client"

export type SortOption = {
  slug: string
  label: string
  value: string
}

const sortIndex = (field: string, direction: "asc" | "desc") =>
  `${PRODUCT_INDEX_NAME}/sort/${field}:${direction}`

/**
 * The price sorts are per currency, so the region's currency picks which
 * indexed price field is sorted on.
 */
export const getSortOptions = (currencyCode: string): SortOption[] => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    { slug: "relevance", label: "Relevance", value: PRODUCT_INDEX_NAME },
    { slug: "price-asc", label: "Price: Low to High", value: sortIndex(minPrice, "asc") },
    { slug: "price-desc", label: "Price: High to Low", value: sortIndex(minPrice, "desc") },
    { slug: "newest", label: "Newest", value: sortIndex("created_at", "desc") },
    { slug: "title-asc", label: "Title: A–Z", value: sortIndex("title", "asc") },
    { slug: "title-desc", label: "Title: Z–A", value: sortIndex("title", "desc") },
  ]
}

export const sortSlugToIndexName = (slug: string | undefined, currencyCode: string) =>
  getSortOptions(currencyCode).find((option) => option.slug === slug)?.value

export const indexNameToSortSlug = (indexName: string | undefined, currencyCode: string) =>
  getSortOptions(currencyCode).find((option) => option.value === indexName)?.slug
