import { isEmpty } from "@/lib/utils/validation"
import { HttpTypes } from "@medusajs/types"

// ============ FORMAT PRICE ============

type FormatPriceParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: FormatPriceParams): string => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

// ============ PERCENTAGE DIFF ============

export const getPricePercentageDiff = (original: number, calculated: number): string => {
  const diff = original - calculated
  const decrease = (diff / original) * 100

  return decrease.toFixed()
}

// ============ PRODUCT PRICE ============

type VariantWithCalculatedPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
    calculated_price?: {
      price_list_type: string
    }
  }
}

export const getPricesForVariant = (variant: VariantWithCalculatedPrice | null | undefined): {
  calculated_price_number: number;
  calculated_price: string;
  original_price_number: number;
  original_price: string;
  currency_code: string;
  price_type: string;
  percentage_diff: string;
} | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: formatPrice({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: formatPrice({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price?.price_list_type ?? "default",
    percentage_diff: getPricePercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variant_id,
}: {
  product: HttpTypes.StoreProduct
  variant_id?: string
}): {
  product: HttpTypes.StoreProduct;
  cheapestPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
  variantPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
} {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const variantsWithPrice = product.variants as VariantWithCalculatedPrice[]
    const cheapestVariant = variantsWithPrice
      .filter((v) => !!v.calculated_price)
      .sort((a, b) => {
        return (
          (a.calculated_price?.calculated_amount ?? 0) -
          (b.calculated_price?.calculated_amount ?? 0)
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variant_id) {
      return null
    }

    const variant = product.variants?.find(
      (v) => v.id === variant_id || v.sku === variant_id
    ) as VariantWithCalculatedPrice | undefined

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}

// ============ PRICE FILTER OPTIONS ============

/**
 * Generate price filter options based on currency code
 * Adjusts ranges to be appropriate for the currency
 */
export const getPriceFilterOptions = (currency_code: string) => {
  const currencyUpper = currency_code.toUpperCase()
  const symbol = formatPrice({ amount: 0, currency_code }).replace(/[\d.,]/g, "").trim()

  // Ranges tuned to office chair price points (base chairs £899–£1,299, add-ons £50–£150)
  if (currencyUpper === "GBP") {
    return [
      { id: "0-500", label: `Under ${symbol}500`, min: 0, max: 500 },
      { id: "500-1000", label: `${symbol}500 – ${symbol}1,000`, min: 500, max: 1000 },
      { id: "1000-1500", label: `${symbol}1,000 – ${symbol}1,500`, min: 1000, max: 1500 },
      { id: "1500-plus", label: `${symbol}1,500+`, min: 1500, max: Infinity },
    ]
  }

  if (currencyUpper === "EUR") {
    return [
      { id: "0-600", label: `Under ${symbol}600`, min: 0, max: 600 },
      { id: "600-1200", label: `${symbol}600 – ${symbol}1,200`, min: 600, max: 1200 },
      { id: "1200-1800", label: `${symbol}1,200 – ${symbol}1,800`, min: 1200, max: 1800 },
      { id: "1800-plus", label: `${symbol}1,800+`, min: 1800, max: Infinity },
    ]
  }

  if (currencyUpper === "USD") {
    return [
      { id: "0-600", label: `Under ${symbol}600`, min: 0, max: 600 },
      { id: "600-1200", label: `${symbol}600 – ${symbol}1,200`, min: 600, max: 1200 },
      { id: "1200-1800", label: `${symbol}1,200 – ${symbol}1,800`, min: 1200, max: 1800 },
      { id: "1800-plus", label: `${symbol}1,800+`, min: 1800, max: Infinity },
    ]
  }

  // Default fallback
  return [
    { id: "0-600", label: `Under ${symbol}600`, min: 0, max: 600 },
    { id: "600-1200", label: `${symbol}600 – ${symbol}1,200`, min: 600, max: 1200 },
    { id: "1200-1800", label: `${symbol}1,200 – ${symbol}1,800`, min: 1200, max: 1800 },
    { id: "1800-plus", label: `${symbol}1,800+`, min: 1800, max: Infinity },
  ]
}
