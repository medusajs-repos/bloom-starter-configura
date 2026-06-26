import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown } from "@medusajs/icons"
import { clsx } from "clsx"
import { sdk } from "@/lib/utils/sdk"

interface ProductOptionValue {
  id: string
  value: string
}

interface ProductOption {
  id: string
  title: string
  values?: ProductOptionValue[]
}

interface OptionsPickerProps {
  selectedOptionValueIds: string[]
  onToggleOptionValueId: (id: string) => void
  onClearAll?: () => void
}

/**
 * Sidebar filter that lists global (non-exclusive) product options and lets
 * the shopper toggle individual option values. Selection state is owned by
 * the parent (which mirrors it into the `optionValueIds` URL param).
 */
export const OptionsPicker = ({
  selectedOptionValueIds,
  onToggleOptionValueId,
  onClearAll,
}: OptionsPickerProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["store-product-options", "global"],
    queryFn: () =>
      sdk.client.fetch<{ product_options: ProductOption[] }>(
        "/store/product-options",
        {
          query: { is_exclusive: false, fields: "*values" },
        }
      ),
  })

  const productOptions = data?.product_options || []

  if (isLoading) {
    return null
  }

  if (productOptions.length === 0) {
    return null
  }

  const hasSelection = selectedOptionValueIds.length > 0

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 uppercase tracking-wide">
          Options
        </h2>
        {hasSelection && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {productOptions.map((option) => (
          <OptionGroup
            key={option.id}
            option={option}
            selectedOptionValueIds={selectedOptionValueIds}
            onToggleOptionValueId={onToggleOptionValueId}
          />
        ))}
      </div>
    </div>
  )
}

const OptionGroup = ({
  option,
  selectedOptionValueIds,
  onToggleOptionValueId,
}: {
  option: ProductOption
  selectedOptionValueIds: string[]
  onToggleOptionValueId: (id: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const values = option.values || []
  if (values.length === 0) {
    return null
  }

  return (
    <div className="border-b border-neutral-200 pb-6">
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full mb-4"
      >
        <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
          {option.title}
        </span>
        <ChevronDown
          className={clsx(
            "w-4 h-4 text-neutral-600 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => {
            const isSelected = selectedOptionValueIds.includes(value.id)
            return (
              <button
                key={value.id}
                type="button"
                onClick={() => onToggleOptionValueId(value.id)}
                className={clsx(
                  "px-3 py-1.5 text-xs uppercase tracking-wide border transition-colors",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                )}
              >
                {value.value}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
