import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"
import ProductOptionSelect from "@/components/product-option-select"
import ProductPrice from "@/components/product-price"
import { Button } from "@/components/ui/button"
import { useCartDrawer } from "@/lib/hooks/use-cart-drawer"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { getVariantOptionsKeymap, isVariantInStock } from "@/lib/utils/product"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useLocation } from "@tanstack/react-router"
import { isEqual } from "lodash-es"
import { useEffect, useMemo, useRef, useState, memo } from "react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  disabled?: boolean;
  countryCode?: string;
  onVariantChange?: (variant: HttpTypes.StoreProductVariant | undefined) => void;
  onOptionsChange?: (options: Record<string, string>) => void;
};

const ProductActions = memo(function ProductActions({
  product,
  region,
  disabled,
  countryCode: countryCodeProp,
  onVariantChange,
  onOptionsChange,
}: ProductActionsProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | undefined>
  >({})
  const [quantity, setQuantity] = useState(1)
  const location = useLocation()
  const countryCode = countryCodeProp || getCountryCodeFromPath(location.pathname) || "dk"

  const addToCartMutation = useAddToCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })
  const { openCart } = useCartDrawer()

  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedOptions({})
  }, [product?.handle])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product?.variants?.length === 1) {
      const optionsKeymap = getVariantOptionsKeymap(
        product?.variants?.[0]?.options ?? []
      )
      setSelectedOptions(optionsKeymap ?? {})
    }
  }, [product?.variants])

  const selectedVariant = useMemo(() => {
    if (!product?.variants || product?.variants.length === 0) {
      return
    }

    // If there's only one variant and no options, select it directly
    if (
      product?.variants.length === 1 &&
      (!product?.options || product?.options.length === 0)
    ) {
      return product?.variants[0]
    }

    const variant = product?.variants.find((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? [])
      const matches = isEqual(optionsKeymap, selectedOptions)

      return matches
    })

    return variant
  }, [product?.variants, product?.options, selectedOptions])

  // Notify parent component when variant changes
  useEffect(() => {
    onVariantChange?.(selectedVariant)
  }, [selectedVariant, onVariantChange])

  // Notify parent component when options change
  useEffect(() => {
    // Filter out undefined values before calling callback
    const definedOptions: Record<string, string> = {}
    for (const [key, value] of Object.entries(selectedOptions)) {
      if (value !== undefined) {
        definedOptions[key] = value
      }
    }
    onOptionsChange?.(definedOptions)
  }, [selectedOptions, onOptionsChange])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product?.variants?.some((v) => {
      const optionsKeymap = getVariantOptionsKeymap(v?.options ?? [])
      return isEqual(optionsKeymap, selectedOptions)
    })
  }, [product?.variants, selectedOptions])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If no variant is selected, we can't add to cart
    if (!selectedVariant) {
      return false
    }

    return isVariantInStock(selectedVariant)
  }, [selectedVariant])

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    addToCartMutation.mutateAsync(
      {
        variant_id: selectedVariant.id,
        quantity: quantity,
        country_code: countryCode,
        product,
        variant: selectedVariant,
        region,
      },
      {
        onSuccess: () => {
          openCart()
        },
      }
    )
  }

  return (
    <div className="flex flex-col" ref={actionsRef}>
      {/* Variant options (color, size, etc.) */}
      {(product.variants?.length ?? 0) > 1 && (
        <div className="flex flex-col gap-y-6 mb-8">
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <ProductOptionSelect
                  option={option}
                  current={selectedOptions[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || addToCartMutation.isPending}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Starting Price Label + Price */}
      <div className="mb-6">
        <p className="text-xs text-neutral-600 mb-2 tracking-wide uppercase">Starting Price</p>
        <ProductPrice
          product={product as HttpTypes.StoreProduct}
          variant={selectedVariant}
          priceProps={{
            textSize: "large",
          }}
        />
      </div>

      {/* Quantity selector - right aligned */}
      <div className="flex items-center justify-between mb-6">
        <label className="text-sm font-medium text-neutral-900">Quantity</label>
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || !!disabled}
            className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg"
            type="button"
          >
            −
          </button>
          <span className="w-12 text-center font-medium text-neutral-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={!!disabled}
            className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons - side by side */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || !isValidVariant}
          className="flex-1 bg-black text-white hover:bg-neutral-800 py-6 text-sm font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Select variant"
            : !inStock || !isValidVariant
              ? "Out of stock"
              : "Add to cart"}
        </Button>
        <a
          href={`/${countryCode}/products/configure/${product.handle}`}
          className="flex-1 flex items-center justify-center bg-white text-neutral-900 border border-neutral-900 hover:bg-neutral-50 transition-colors py-6 text-sm font-medium tracking-wider uppercase rounded-lg text-center"
        >
          Customize
        </a>
      </div>
    </div>
  )
})

export default ProductActions
