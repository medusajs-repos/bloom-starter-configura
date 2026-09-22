import { Price } from "@/components/ui/price"
import { Thumbnail } from "@/components/ui/thumbnail"
import { hitPricing, type ProductHit } from "@/lib/search-client"
import { getPricePercentageDiff } from "@/lib/utils/price"
import { Link } from "@tanstack/react-router"

export const SearchProductCard = ({
  hit,
  countryCode,
  currencyCode,
}: {
  hit: ProductHit
  countryCode: string
  currencyCode: string
}) => {
  if (!hit.handle) {
    return null
  }

  const pricing = hitPricing(hit, currencyCode)
  const maxPrice = pricing.max_price ?? pricing.min_price
  const isRange =
    pricing.min_price !== null && (maxPrice ?? 0) > pricing.min_price
  // A range already spans the discount, so the struck-through original would
  // describe only the cheapest variant.
  const isDiscounted = pricing.on_sale && !isRange

  return (
    <Link
      to="/$countryCode/products/$handle"
      params={{ countryCode, handle: hit.handle }}
      className="group flex flex-col w-full"
      data-testid="search-product-card"
    >
      <div className="aspect-square w-full overflow-hidden bg-[#F5F3F0] relative">
        <Thumbnail
          thumbnail={hit.thumbnail}
          alt={hit.title ?? ""}
          className="absolute inset-0 object-cover object-center w-full h-full"
        />
        {pricing.on_sale && (
          <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] uppercase tracking-wider px-2 py-1">
            Sale
          </span>
        )}
      </div>

      <div className="flex text-sm mt-3 justify-between items-start gap-2">
        <span className="text-neutral-800 font-normal tracking-wide">
          {hit.title}
        </span>
        {pricing.min_price !== null && (
          <Price
            price={pricing.min_price}
            type={isRange ? "range" : "default"}
            currencyCode={pricing.currency_code}
            textSize="small"
            className="text-neutral-600 whitespace-nowrap items-end"
            originalPrice={
              isDiscounted
                ? {
                    price: pricing.original_price!,
                    percentage: getPricePercentageDiff(
                      pricing.original_price!,
                      pricing.min_price
                    ),
                  }
                : undefined
            }
          />
        )}
      </div>
    </Link>
  )
}
