import { SEARCH_FACETS } from "@/lib/search-client"
import { formatPrice } from "@/lib/utils/price"
import { XMark } from "@medusajs/icons"
import { useClearRefinements, useCurrentRefinements } from "react-instantsearch"

const ATTRIBUTE_LABELS: Record<string, string> = {
  [SEARCH_FACETS.category]: "Category",
  [SEARCH_FACETS.optionValues]: "Option",
  [SEARCH_FACETS.onSale]: "On sale",
  [SEARCH_FACETS.minPrice]: "Price",
}

const OPERATOR_LABELS: Record<string, string> = {
  ">=": "from",
  "<=": "up to",
  ">": "over",
  "<": "under",
  "=": "",
  "!=": "not",
}

export const SearchCurrentRefinements = ({
  currencyCode,
}: {
  currencyCode: string
}) => {
  const { items, refine } = useCurrentRefinements()
  const { refine: clearAll, canRefine: canClearAll } = useClearRefinements()

  if (!items.length) {
    return null
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 pt-4"
      data-testid="search-current-refinements"
    >
      {items.flatMap((item) =>
        item.refinements.map((refinement) => {
          const isPrice = item.attribute === SEARCH_FACETS.minPrice
          const isOption = item.attribute === SEARCH_FACETS.optionValues

          let label = String(refinement.label)

          if (isPrice) {
            const operator = OPERATOR_LABELS[refinement.operator ?? "="] ?? ""
            const amount = Number(refinement.value)

            label = [
              operator,
              Number.isFinite(amount)
                ? formatPrice({ amount, currency_code: currencyCode })
                : refinement.label,
            ]
              .filter(Boolean)
              .join(" ")
          } else if (isOption) {
            // `"Color:Sand"` reads better split back into its two halves.
            label = label.replace(":", ": ")
          }

          return (
            <button
              key={`${item.attribute}-${refinement.label}-${refinement.operator ?? ""}`}
              type="button"
              onClick={() => refine(refinement)}
              className="flex items-center gap-1.5 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800 hover:border-neutral-900 transition-colors"
            >
              <span className="text-neutral-500">
                {ATTRIBUTE_LABELS[item.attribute] ?? item.attribute}
              </span>
              {item.attribute !== SEARCH_FACETS.onSale && <span>{label}</span>}
              <XMark className="w-3 h-3" />
            </button>
          )
        })
      )}

      {canClearAll && (
        <button
          type="button"
          onClick={() => clearAll()}
          className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          data-testid="search-clear-refinements"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
