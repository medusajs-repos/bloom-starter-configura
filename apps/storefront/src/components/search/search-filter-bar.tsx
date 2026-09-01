import { SEARCH_FACETS } from "@/lib/search-client"
import { SORT_OPTIONS } from "@/lib/search-sort"
import { formatPrice } from "@/lib/utils/price"
import { ChevronDown } from "@medusajs/icons"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  useRange,
  useRefinementList,
  useSortBy,
  useStats,
  useToggleRefinement,
} from "react-instantsearch"

type DropdownProps = {
  id: string
  label: string
  activeCount?: number
  openId: string | null
  onToggle: (id: string) => void
  children: React.ReactNode
  align?: "left" | "right"
}

const Dropdown = ({
  id,
  label,
  activeCount = 0,
  openId,
  onToggle,
  children,
  align = "left",
}: DropdownProps) => {
  const isOpen = openId === id

  return (
    <div className="relative" data-search-dropdown>
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
        data-testid={`search-filter-${id}`}
      >
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="bg-neutral-900 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {activeCount}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-neutral-600" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[220px] max-h-80 overflow-y-auto`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

type FacetCheckboxListProps = {
  items: { value: string; label: string; count: number; isRefined: boolean }[]
  onRefine: (value: string) => void
}

const FacetCheckboxList = ({ items, onRefine }: FacetCheckboxListProps) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.value}>
          <label className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => onRefine(item.value)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
            />
            <span className={`flex-1 ${item.isRefined ? "font-medium" : ""}`}>
              {item.label}
            </span>
            {/* The count comes from the engine and moves as other filters apply. */}
            <span className="text-xs text-neutral-500">{item.count}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

type SharedDropdownProps = {
  openId: string | null
  onToggle: (id: string) => void
}

const CategoryRefinement = ({ openId, onToggle }: SharedDropdownProps) => {
  const { items, refine } = useRefinementList({
    attribute: SEARCH_FACETS.category,
    limit: 100,
    sortBy: ["name:asc"],
  })

  if (!items.length) {
    return null
  }

  return (
    <Dropdown
      id="category"
      label="Category"
      activeCount={items.filter((item) => item.isRefined).length}
      openId={openId}
      onToggle={onToggle}
    >
      <FacetCheckboxList items={items} onRefine={refine} />
    </Dropdown>
  )
}

const OptionValueRefinements = ({ openId, onToggle }: SharedDropdownProps) => {
  const { items, refine } = useRefinementList({
    attribute: SEARCH_FACETS.optionValues,
    limit: 500,
    sortBy: ["name:asc"],
  })

  const groups = useMemo(() => {
    const byTitle = new Map<string, typeof items>()

    for (const item of items) {
      const separatorIndex = item.value.indexOf(":")

      if (separatorIndex < 1) {
        continue
      }

      const title = item.value.slice(0, separatorIndex)
      const existing = byTitle.get(title) ?? []

      byTitle.set(title, [...existing, item])
    }

    return Array.from(byTitle.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [items])

  if (!groups.length) {
    return null
  }

  return (
    <>
      {groups.map(([title, groupItems]) => (
        <Dropdown
          key={title}
          id={`option-${title}`}
          label={title}
          activeCount={groupItems.filter((item) => item.isRefined).length}
          openId={openId}
          onToggle={onToggle}
        >
          <FacetCheckboxList
            items={groupItems.map((item) => ({
              ...item,
              label: item.value.slice(title.length + 1),
            }))}
            onRefine={refine}
          />
        </Dropdown>
      ))}
    </>
  )
}

const OnSaleRefinement = () => {
  const { value, refine } = useToggleRefinement({
    attribute: SEARCH_FACETS.onSale,
    on: true,
  })

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-900 cursor-pointer">
      <input
        type="checkbox"
        checked={value.isRefined}
        onChange={() => refine(value)}
        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        data-testid="search-filter-on-sale"
      />
      <span className={value.isRefined ? "font-medium" : ""}>On sale</span>
      {value.onFacetValue?.count ? (
        <span className="text-xs text-neutral-500">
          {value.onFacetValue.count}
        </span>
      ) : null}
    </label>
  )
}

const PriceRefinement = ({
  openId,
  onToggle,
  currencyCode,
}: SharedDropdownProps & { currencyCode: string }) => {
  const { start, range, refine, canRefine } = useRange({
    attribute: SEARCH_FACETS.minPrice,
  })

  const { min, max } = range
  const [startMin, startMax] = start

  const toInput = (value: number | undefined, bound: number | undefined) =>
    value === undefined || value === -Infinity || value === Infinity
      ? ""
      : String(value ?? bound ?? "")

  const [draft, setDraft] = useState({ min: "", max: "" })

  useEffect(() => {
    setDraft({ min: toInput(startMin, min), max: toInput(startMax, max) })
  }, [startMin, startMax, min, max])

  const isRefined =
    (startMin !== undefined && startMin !== -Infinity) ||
    (startMax !== undefined && startMax !== Infinity)

  return (
    <Dropdown
      id="price"
      label="Price"
      activeCount={isRefined ? 1 : 0}
      openId={openId}
      onToggle={onToggle}
    >
      {!canRefine || min === undefined || max === undefined ? (
        <p className="px-4 py-3 text-sm text-neutral-500">
          No price range available.
        </p>
      ) : (
        <form
          className="p-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            // One refine, on submit — never per keystroke.
            refine([
              draft.min === "" ? undefined : Number(draft.min),
              draft.max === "" ? undefined : Number(draft.max),
            ])
          }}
        >
          <p className="text-xs text-neutral-500">
            {formatPrice({ amount: min, currency_code: currencyCode })} –{" "}
            {formatPrice({ amount: max, currency_code: currencyCode })}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={min}
              max={max}
              value={draft.min}
              placeholder={String(min)}
              aria-label="Minimum price"
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, min: event.target.value }))
              }
              className="w-full border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900"
            />
            <span className="text-neutral-400">–</span>
            <input
              type="number"
              inputMode="decimal"
              min={min}
              max={max}
              value={draft.max}
              placeholder={String(max)}
              aria-label="Maximum price"
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, max: event.target.value }))
              }
              className="w-full border border-neutral-300 px-2 py-1.5 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-neutral-900 text-white text-xs uppercase tracking-wider py-2 hover:bg-neutral-700 transition-colors"
            data-testid="search-filter-price-apply"
          >
            Apply
          </button>
        </form>
      )}
    </Dropdown>
  )
}

const SortRefinement = ({ openId, onToggle }: SharedDropdownProps) => {
  const { currentRefinement, options, refine } = useSortBy({
    items: SORT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  })

  const selected = options.find((option) => option.value === currentRefinement)

  return (
    <Dropdown
      id="sort"
      label={`Sort: ${selected?.label ?? "Relevance"}`}
      openId={openId}
      onToggle={onToggle}
      align="right"
    >
      <ul>
        {options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => {
                refine(option.value)
                onToggle("sort")
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                option.value === currentRefinement
                  ? "bg-neutral-100 font-medium"
                  : "hover:bg-neutral-50"
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}

const ResultCount = () => {
  const { nbHits, processingTimeMS } = useStats()

  return (
    <span
      className="text-sm text-neutral-600 hidden md:inline"
      title={`${processingTimeMS}ms`}
      data-testid="search-result-count"
    >
      {nbHits} {nbHits === 1 ? "product" : "products"}
    </span>
  )
}

export const SearchFilterBar = ({ currencyCode }: { currencyCode: string }) => {
  const [openId, setOpenId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-neutral-200"
    >
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-sm text-neutral-600 hidden sm:inline">Filter:</span>
        <CategoryRefinement openId={openId} onToggle={toggle} />
        <OptionValueRefinements openId={openId} onToggle={toggle} />
        <PriceRefinement
          openId={openId}
          onToggle={toggle}
          currencyCode={currencyCode}
        />
        <OnSaleRefinement />
      </div>

      <div className="flex items-center gap-6">
        <SortRefinement openId={openId} onToggle={toggle} />
        <ResultCount />
      </div>
    </div>
  )
}
