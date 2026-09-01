import { SearchProductCard } from "@/components/search/search-product-card"
import { Loading } from "@/components/ui/loading"
import type { ProductHit } from "@/lib/search-client"
import { useSearchSettled } from "@/lib/hooks/use-search-settled"
import { useHits, useInstantSearch } from "react-instantsearch"

export const SearchProductGrid = ({
  countryCode,
}: {
  countryCode: string
}) => {
  const { items } = useHits<ProductHit>()
  const { status, error, indexUiState } = useInstantSearch()
  const { isSettled, hasNoResultsYet, resultsQuery } = useSearchSettled()

  const query = (indexUiState.query ?? "").trim()

  const hasStaleCatalogue = Boolean(query) && !resultsQuery

  const hasNothingValid = hasNoResultsYet || hasStaleCatalogue

  if (status === "error") {
    return (
      <p
        className="py-12 text-sm text-red-600"
        data-testid="search-error"
      >
        Couldn&apos;t load products
        {error?.message ? `: ${error.message}` : "."}
      </p>
    )
  }

  if (hasNothingValid) {
    return (
      <div className="py-8" data-testid="search-loading">
        <Loading rows={3} columns={4} height="h-64" />
      </div>
    )
  }

  if (!items.length) {
    return (
      <p className="py-12 text-neutral-600" data-testid="search-no-results">
        {resultsQuery
          ? `No products found for "${resultsQuery}".`
          : "No products match these filters."}
        {!isSettled && " Still searching…"}
      </p>
    )
  }

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8"
      data-testid="search-product-grid"
    >
      {items.map((hit) => (
        <SearchProductCard
          key={hit.objectID}
          hit={hit}
          countryCode={countryCode}
        />
      ))}
    </div>
  )
}
