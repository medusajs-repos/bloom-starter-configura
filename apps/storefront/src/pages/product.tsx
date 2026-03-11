import ProductActions from "@/components/product-actions"
import { ImageGalleryEnhanced } from "@/components/ui/image-gallery-enhanced"
import { ProductAccordions } from "@/components/product/product-accordions"
import { RelatedProducts } from "@/components/product/related-products"
import { useLoaderData, useLocation } from "@tanstack/react-router"
import { useProducts } from "@/lib/hooks/use-products"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"

/**
 * Audo Copenhagen-style Product Page
 * 
 * Features:
 * - Large image on left, details on right
 * - Clean minimal design
 * - Trade professional info box
 * - Customization section
 * - Dimensions and materials
 */
const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle",
  })
  
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const handleVariantChange = useCallback((_variant: HttpTypes.StoreProductVariant | undefined) => {
    // Variant tracking available for future use
  }, [])

  const handleOptionsChange = useCallback((options: Record<string, string | undefined>) => {
    // Filter out undefined values
    const definedOptions = Object.entries(options).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    setSelectedOptions(definedOptions)
  }, [])

  // Fetch related products
  const { data: relatedProductsData } = useProducts({
    query_params: {
      limit: 5,
      fields: "id,title,handle,thumbnail,*variants.calculated_price",
    },
    region_id: region.id,
  })

  const relatedProducts =
    relatedProductsData?.pages
      .flatMap((page) => page.products)
      .filter((p) => p.id !== product.id)
      .slice(0, 4) || []

  // Reorder images based on selected color option
  const displayImages = useMemo(() => {
    const allImages = product.images || []
    
    const colorOption = product.options?.find(
      (opt: HttpTypes.StoreProductOption) => opt.title.toLowerCase() === "color"
    )
    
    if (!colorOption) {
      return allImages
    }

    const selectedColorValue = selectedOptions[colorOption.id]
    
    if (!selectedColorValue) {
      return allImages
    }

    const matchingVariants = product.variants?.filter((variant: HttpTypes.StoreProductVariant) => {
      return variant.options?.some(
        (opt: HttpTypes.StoreProductOptionValue) => opt.option_id === colorOption.id && opt.value === selectedColorValue
      )
    }) || []

    const variantImageIds = new Set(
      matchingVariants.flatMap((v: HttpTypes.StoreProductVariant) => v.images?.map((img: HttpTypes.StoreProductImage) => img.id) || [])
    )

    const variantImages = allImages.filter((img: HttpTypes.StoreProductImage) => variantImageIds.has(img.id))
    const otherImages = allImages.filter((img: HttpTypes.StoreProductImage) => !variantImageIds.has(img.id))

    return [...variantImages, ...otherImages]
  }, [product.images, product.options, product.variants, selectedOptions])

  return (
    <>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Large Product Image */}
          <div className="lg:pr-8">
            <ImageGalleryEnhanced images={displayImages} />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Product Title */}
            <h1 className="text-4xl md:text-5xl font-display font-normal text-neutral-900 mb-6 tracking-tight">
              {product.title}
            </h1>

            {/* Product Description */}
            {product.description && (
              <p className="text-neutral-700 leading-relaxed text-base mb-8">
                {product.description}
              </p>
            )}

            {/* Price & Add to Cart Actions */}
            <ProductActions 
              product={product} 
              region={region}
              onVariantChange={handleVariantChange}
              onOptionsChange={handleOptionsChange}
              countryCode={countryCode}
            />

            {/* Dimensions */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Dimensions</h3>
              <p className="text-sm text-neutral-700">
                W: 62cm × D: 62cm × H: 82-92cm (seat height: 42-52cm adjustable)
              </p>
            </div>

            {/* Materials */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Materials</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Premium fabric upholstery, steel frame with powder-coated finish, high-density foam cushioning, adjustable gas lift mechanism.
              </p>
            </div>

            {/* Additional Info Accordions */}
            <div className="mt-8">
              <ProductAccordions />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} countryCode={countryCode} />
      )}
    </>
  )
}

export default ProductDetails
