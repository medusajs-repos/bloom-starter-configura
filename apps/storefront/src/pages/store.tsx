import { SearchBox } from "@/components/search/search-box"
import { SearchCurrentRefinements } from "@/components/search/search-current-refinements"
import { SearchFilterBar } from "@/components/search/search-filter-bar"
import { SearchPagination } from "@/components/search/search-pagination"
import { SearchProductGrid } from "@/components/search/search-product-grid"
import { PRODUCT_INDEX_NAME, searchClient } from "@/lib/search-client"
import { productSearchRouting } from "@/lib/search-routing"
import { useLoaderData } from "@tanstack/react-router"
import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

const HITS_PER_PAGE = 12

const Store = () => {
  const loaderData = useLoaderData({ from: "/$countryCode/store" })
  const { region } = loaderData || {}
  const { countryCode } = loaderData || {}

  const currencyCode = region?.currency_code || "usd"

  return (
    <div className="content-container pt-32 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-neutral-900 tracking-tight">
          All Products
        </h1>
      </div>

      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing={productSearchRouting}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={HITS_PER_PAGE} />

        <div className="max-w-md">
          <SearchBox />
        </div>

        <SearchFilterBar currencyCode={currencyCode} />
        <SearchCurrentRefinements currencyCode={currencyCode} />

        <SearchProductGrid countryCode={countryCode} />

        <SearchPagination />
      </InstantSearch>
    </div>
  )
}

export default Store
