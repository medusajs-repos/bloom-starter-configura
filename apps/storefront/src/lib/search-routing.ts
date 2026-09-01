import { history } from "instantsearch.js/es/lib/routers"
import type { UiState } from "instantsearch.js"
import { PRODUCT_INDEX_NAME } from "@/lib/search-client"
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

export const productSearchRouting = {
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
        sale: indexUiState.toggle?.on_sale ? "true" : undefined,
        price: indexUiState.range?.min_price,
        sort: indexNameToSortSlug(indexUiState.sortBy),
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
            ? { toggle: { on_sale: true } }
            : {}),
          ...(routeState.price
            ? { range: { min_price: routeState.price } }
            : {}),
          sortBy: sortSlugToIndexName(routeState.sort),
          page: Number.isFinite(page) && page > 1 ? page : undefined,
        },
      }
    },
  },
}
