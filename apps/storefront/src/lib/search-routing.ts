import { history } from "instantsearch.js/es/lib/routers"
import type { UiState } from "instantsearch.js"
import { PRODUCT_INDEX_NAME, priceAttribute } from "@/lib/search-client"
import { indexNameToSortSlug, sortSlugToIndexName } from "@/lib/search-sort"

type ProductRouteState = {
  q?: string
  category?: string | string[]
  options?: string | string[]
  sale?: string
  price?: string
  sort?: string
  page?: string
}

const SERVER_LOCATION = {
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "",
  pathname: "/",
  port: "",
  protocol: "",
  search: "",
} as unknown as Location

const toArray = (value: string | string[] | undefined): string[] | undefined => {
  if (value === undefined) {
    return undefined
  }

  const values = (Array.isArray(value) ? value : [value]).filter(Boolean)

  return values.length ? values : undefined
}

/**
 * The URL keys stay currency-agnostic (`price`, `sale`) while the refinements
 * they map to are per currency, so a shared link keeps working in a region
 * that prices in something else.
 */
export const getProductSearchRouting = (currencyCode: string) => {
  const priceAttributeName = priceAttribute("min_price", currencyCode)
  const onSaleAttributeName = priceAttribute("on_sale", currencyCode)

  return {
    router: history<ProductRouteState>({
      getLocation: () =>
        typeof window === "undefined" ? SERVER_LOCATION : window.location,
    }),
    stateMapping: {
      stateToRoute(uiState: UiState): ProductRouteState {
        const indexUiState = uiState[PRODUCT_INDEX_NAME] ?? {}

        return {
          q: indexUiState.query || undefined,
          category: indexUiState.refinementList?.category,
          options: indexUiState.refinementList?.option_values,
          sale: indexUiState.toggle?.[onSaleAttributeName] ? "true" : undefined,
          price: indexUiState.range?.[priceAttributeName],
          sort: indexNameToSortSlug(indexUiState.sortBy, currencyCode),
          page:
            indexUiState.page && indexUiState.page > 1
              ? String(indexUiState.page)
              : undefined,
        }
      },
      routeToState(routeState: ProductRouteState = {}): UiState {
        const category = toArray(routeState.category)
        const optionValues = toArray(routeState.options)
        const page = Number(routeState.page)

        return {
          [PRODUCT_INDEX_NAME]: {
            query: routeState.q,
            refinementList: {
              ...(category ? { category } : {}),
              ...(optionValues ? { option_values: optionValues } : {}),
            },
            ...(routeState.sale === "true"
              ? { toggle: { [onSaleAttributeName]: true } }
              : {}),
            ...(routeState.price
              ? { range: { [priceAttributeName]: routeState.price } }
              : {}),
            sortBy: sortSlugToIndexName(routeState.sort, currencyCode),
            page: Number.isFinite(page) && page > 1 ? page : undefined,
          },
        }
      },
    },
  }
}
