import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Loading } from "@/components/ui/loading"
import { SearchHit, type ProductHit } from "@/components/search/search-hit"
import { useSearchSettled } from "@/lib/hooks/use-search-settled"
import { PRODUCT_INDEX_NAME, searchClient } from "@/lib/search-client"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { MagnifyingGlass } from "@medusajs/icons"
import { useLocation } from "@tanstack/react-router"
import type { SearchClient } from "instantsearch.js"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Configure,
  InstantSearch,
  useHits,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch"

const HITS_PER_PAGE = 12
const DEBOUNCE_MS = 250

type SearchPanelProps = {
  countryCode: string
  onNavigate: () => void
}

const SearchPanel = ({ countryCode, onNavigate }: SearchPanelProps) => {
  const timer = useRef<number | undefined>(undefined)

  // Collapses a burst of typing into one request: every keystroke resets the
  // timer, and only the last one reaches the engine.
  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const { items } = useHits<ProductHit>()
  const { status, error } = useInstantSearch()
  const { isSettled, resultsQuery, hasNoResultsYet } = useSearchSettled()

  // The input is controlled locally so it stays responsive while `query` — the
  // value InstantSearch has actually searched for — trails behind the debounce.
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trimmedInput = inputValue.trim()
  const trimmedQuery = query.trim()

  const hasInput = Boolean(trimmedInput)
  // The debounce hasn't fired yet, so `query` is still the previous search.
  const isPending = trimmedInput !== trimmedQuery

  const hasStaleResults = hasInput && !resultsQuery

  const hasNothingValid = hasNoResultsYet || hasStaleResults
  const hasResults = hasInput && !hasNothingValid && items.length > 0

  return (
    <>
      <div className="flex items-center gap-x-3 border-b border-zinc-200 px-6">
        <MagnifyingGlass className="flex-shrink-0 text-zinc-600" />
        <input
          type="search"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
            refine(event.target.value)
          }}
          placeholder="Search products"
          aria-label="Search products"
          autoFocus
          className="w-full bg-transparent py-4 text-base text-[#0a0a0a] outline-none placeholder:text-zinc-500"
          data-testid="search-input"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* A failed search reports itself rather than looking like "no matches". */}
        {status === "error" ? (
          <p
            className="px-6 py-6 text-center text-sm text-red-600"
            data-testid="search-error"
          >
            Couldn&apos;t search products
            {error?.message ? `: ${error.message}` : "."}
          </p>
        ) : !hasInput ? (
          <p
            className="px-6 py-6 text-center text-sm text-zinc-600"
            data-testid="search-empty"
          >
            Start typing to search for products.
          </p>
        ) : hasResults ? (
          <ul className="py-2" data-testid="search-results">
            {items.map((hit) => (
              <SearchHit
                key={hit.objectID}
                hit={hit}
                countryCode={countryCode}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        ) : hasNothingValid || isPending || !isSettled ? (
          // Nothing trustworthy is on screen yet: the first search of the
          // session, or results belonging to the empty query.
          <div data-testid="search-loading">
            <Loading rows={4} height="h-16" className="px-6 py-4" />
          </div>
        ) : (
          <p
            className="px-6 py-6 text-center text-sm text-zinc-600"
            data-testid="search-no-results"
          >
            No products found for &quot;{resultsQuery}&quot;
          </p>
        )}
      </div>
    </>
  )
}

export const SearchDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || "gb"

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        aria-label="Search"
        className="p-2.5 hover:text-[#737373] transition-colors"
        data-testid="nav-search-button"
      >
        <MagnifyingGlass className="w-[18px] h-[18px]" />
      </DrawerTrigger>
      <DrawerContent side="right" className="flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-xs tracking-widest uppercase font-medium">
            Search
          </DrawerTitle>
        </DrawerHeader>
        <InstantSearch
          indexName={PRODUCT_INDEX_NAME}
          searchClient={searchClient as unknown as SearchClient}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <Configure hitsPerPage={HITS_PER_PAGE} />
          <SearchPanel
            countryCode={countryCode}
            onNavigate={() => setIsOpen(false)}
          />
        </InstantSearch>
      </DrawerContent>
    </Drawer>
  )
}
