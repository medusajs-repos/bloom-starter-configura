import { retrieveProduct } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { ProductConfigurator } from "@/components/product-configurator"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { useState } from "react"

export const Route = createFileRoute(
  "/$countryCode/products/$handle/configure"
)({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params
    const { queryClient } = context

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", countryCode],
      queryFn: () => getRegion({ country_code: countryCode }),
    })

    if (!region || !handle) {
      throw notFound()
    }

    const product = await queryClient.ensureQueryData({
      queryKey: ["product", handle, region.id],
      queryFn: async () => {
        try {
          return await retrieveProduct({
            handle,
            region_id: region.id,
            fields: "*variants, *images, *options, *options.values",
          })
        } catch {
          throw notFound()
        }
      },
    })

    // Fetch configurator data
    const configuratorData = await queryClient.ensureQueryData({
      queryKey: ["configurator", product.id, region.currency_code],
      queryFn: async () => {
        const response: any = await sdk.client.fetch(
          `/store/configurators?product_id=${product.id}&currency_code=${region.currency_code}`
        )
        return response.configurator
      },
    })

    return {
      countryCode,
      region,
      product,
      configurator: configuratorData,
    }
  },
  component: ConfigurePage,
})

function ConfigurePage() {
  const { product, countryCode, region, configurator } = Route.useLoaderData()
  const navigate = useNavigate()
  const [isAdding, setIsAdding] = useState(false)
  const addToCart = useAddToCart()

  const handleClose = () => {
    navigate({
      to: "/$countryCode/products/$handle",
      params: { countryCode, handle: product.handle! },
    })
  }

  const handleComplete = async (configuration: Record<string, string>, totalPrice: number) => {
    setIsAdding(true)
    try {
      // Get the first variant (configured products typically have one main variant)
      const variant = product.variants?.[0]
      
      if (!variant) {
        console.error("No variant found for product")
        return
      }

      // Build configuration summary for metadata
      const configurationSummary = Object.entries(configuration).map(([stepId, optionId]) => {
        const step = configurator.steps.find((s) => s.id === stepId)
        const option = step?.options.find((o) => o.id === optionId)
        return {
          step_name: step?.name,
          option_name: option?.name,
          option_id: optionId,
          price: option?.price || 0,
        }
      })

      await addToCart.mutateAsync({
        variant_id: variant.id,
        quantity: 1,
        country_code: region.countries[0]?.iso_2 || countryCode,
        product,
        variant,
        region,
        metadata: {
          configurator_id: configurator.id,
          configuration,
          configuration_summary: configurationSummary,
          total_configuration_price: totalPrice,
        } as any,
      })

      // Navigate back to product page
      navigate({
        to: "/$countryCode/products/$handle",
        params: { countryCode, handle: product.handle! },
      })
    } catch (error) {
      console.error("Failed to add configured product to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  if (!configurator) {
    return (
      <div className="min-h-screen bg-warmGray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button onClick={handleClose} className="text-sm text-warmGray-600 hover:text-warmGray-900">
              Back to product
            </button>
          </div>
          <h1 className="text-4xl font-serif mb-8">{product.title}</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg text-warmGray-600">
              No configurator found for this product.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProductConfigurator
      product={product}
      region={region}
      configurator={configurator}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  )
}
