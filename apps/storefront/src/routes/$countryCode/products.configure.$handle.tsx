import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { retrieveProduct } from "../../lib/data/products"
import { ProductConfigurator, Configurator } from "@/components/product-configurator"
import { getRegion } from "../../lib/data/regions"
import { sdk } from "@/lib/utils/sdk"
import { getStoredCart, setStoredCart } from "@/lib/utils/cart"
import { createCart } from "../../lib/data/cart"
import { useCartDrawer } from "@/lib/hooks/use-cart-drawer"
import { useQueryClient } from "@tanstack/react-query"

export const Route = createFileRoute(
  "/$countryCode/products/configure/$handle",
)({
  loader: async ({ params, context }) => {
    const { queryClient } = context

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", params.countryCode],
      queryFn: () => getRegion({ country_code: params.countryCode }),
    })

    if (!region) {
      throw new Error("Region not found")
    }

    const product = await retrieveProduct({
      handle: params.handle,
      region_id: region.id,
      fields: "*variants, +variants.inventory_quantity, +variants.manage_inventory, +variants.allow_backorder, *images, *options, *options.values, *collection, *tags, metadata",
    })

    if (!product) {
      throw new Error("Product not found")
    }

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
      product,
      region,
      countryCode: params.countryCode,
      configurator: configuratorData,
    }
  },
  component: ProductConfiguratorPage,
})

function ProductConfiguratorPage() {
  const { product, region, countryCode, configurator } = Route.useLoaderData()
  const navigate = useNavigate()
  const { openCart } = useCartDrawer()
  const queryClient = useQueryClient()
  
  if (!configurator) {
    return <div>No configurator found for this product</div>
  }

  const handleClose = () => {
    navigate({ to: "/$countryCode/products/$handle", params: { countryCode, handle: product.handle } })
  }

  const handleComplete = async (
    configuration: Record<string, string>,
    totalPrice: number,
    configurationDetails?: Array<{ stepName: string; optionName: string; price: number }>
  ) => {
    try {
      // Get or create cart
      let cartId = getStoredCart()
      
      if (!cartId) {
        const cart = await createCart({ region_id: region.id })
        cartId = cart.id
      }

      // Add configured product to cart via custom endpoint
      await sdk.client.fetch(`/store/carts/${cartId}/configured-item`, {
        method: "POST",
        body: {
          variant_id: product.variants[0].id,
          quantity: 1,
          configuration,
          configured_price: totalPrice,
          configuration_details: configurationDetails || [],
        },
      })

      // Invalidate cart queries to refresh the cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      
      // Close configurator and open cart drawer
      handleClose()
      openCart()
    } catch (error: any) {
      console.error("Error adding configured product to cart:", error)
      
      // If customer was deleted, log out and reload
      if (error?.message?.includes("Customer with id:") && error?.message?.includes("was not found")) {
        await sdk.auth.logout()
        alert("Your session has expired. Please refresh the page and try again.")
        window.location.reload()
        return
      }
      
      alert("Failed to add to cart. Please try again.")
    }
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
