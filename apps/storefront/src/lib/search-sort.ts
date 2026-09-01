import { PRODUCT_INDEX_NAME } from "@/lib/search-client"

export type SortOption = {
  slug: string
  label: string
  value: string
}

const sortIndex = (field: string, direction: "asc" | "desc") =>
  `${PRODUCT_INDEX_NAME}/sort/${field}:${direction}`

export const SORT_OPTIONS: SortOption[] = [
  { slug: "relevance", label: "Relevance", value: PRODUCT_INDEX_NAME },
  { slug: "price-asc", label: "Price: Low to High", value: sortIndex("min_price", "asc") },
  { slug: "price-desc", label: "Price: High to Low", value: sortIndex("min_price", "desc") },
  { slug: "newest", label: "Newest", value: sortIndex("created_at", "desc") },
  { slug: "title-asc", label: "Title: A–Z", value: sortIndex("title", "asc") },
  { slug: "title-desc", label: "Title: Z–A", value: sortIndex("title", "desc") },
]

export const sortSlugToIndexName = (slug?: string) =>
  SORT_OPTIONS.find((option) => option.slug === slug)?.value

export const indexNameToSortSlug = (indexName?: string) =>
  SORT_OPTIONS.find((option) => option.value === indexName)?.slug
