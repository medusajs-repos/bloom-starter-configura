import { MagnifyingGlass } from "@medusajs/icons"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchBox } from "react-instantsearch"

const DEBOUNCE_MS = 250

export const SearchBox = () => {
  const timer = useRef<number | undefined>(undefined)

  const queryHook = useCallback(
    (nextQuery: string, search: (value: string) => void) => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => search(nextQuery), DEBOUNCE_MS)
    },
    []
  )

  const { query, refine } = useSearchBox({ queryHook })
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Keeps the field in step with the URL, e.g. after a back navigation.
  useEffect(() => {
    setInputValue((current) => (current.trim() === query.trim() ? current : query))
  }, [query])

  return (
    <div className="flex items-center gap-x-3 border border-neutral-300 px-4 focus-within:border-neutral-900 transition-colors">
      <MagnifyingGlass className="flex-shrink-0 text-neutral-600" />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
          refine(event.target.value)
        }}
        placeholder="Search all products"
        aria-label="Search all products"
        className="w-full bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
        data-testid="store-search-input"
      />
    </div>
  )
}
