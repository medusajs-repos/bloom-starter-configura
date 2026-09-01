import { Price } from "@/components/ui/price"
import { Thumbnail } from "@/components/ui/thumbnail"
import type { ProductHit } from "@/lib/search-client"
import { getPricePercentageDiff } from "@/lib/utils/price"
import { Link } from "@tanstack/react-router"

export const SearchProductCard = ({
  hit,
  countryCode,
}: {
  hit: ProductHit
  countryCode: string
}) => {
  if (!hit.handle) {
    return null
  }

  const price = typeof hit.min_price === "number" ? hit.min_price : undefined
  const originalPrice =
    typeof hit.original_price === "number" ? hit.original_price : undefined
  const currencyCode = hit.currency_code ?? undefined
  const isDiscounted =
    price !== undefined && originalPrice !== undefined && originalPrice > price

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
        {hit.on_sale && (
          <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] uppercase tracking-wider px-2 py-1">
            Sale
          </span>
        )}
      </div>

      <div className="flex text-sm mt-3 justify-between items-start gap-2">
        <span className="text-neutral-800 font-normal tracking-wide">
          {hit.title}
        </span>
        {price !== undefined && currencyCode && (
          <Price
            price={price}
            currencyCode={currencyCode}
            textSize="small"
            className="text-neutral-600 whitespace-nowrap items-end"
            originalPrice={
              isDiscounted
                ? {
                    price: originalPrice,
                    percentage: getPricePercentageDiff(originalPrice, price),
                  }
                : undefined
            }
          />
        )}
      </div>
    </Link>
  )
}
