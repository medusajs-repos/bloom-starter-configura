import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, QueryContext } from "@medusajs/framework/utils"

type ProductWithCalculatedPrice = {
  id: string
  title: string
  handle: string
  variants: Array<{
    id: string
    calculated_price?: {
      calculated_amount: number
    }
  }>
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { product_id, currency_code } = req.query

  if (!product_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "product_id query parameter is required"
    )
  }

  if (!currency_code) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "currency_code query parameter is required"
    )
  }

  // Fetch configurator with all its steps and options
  const { data: configurators } = await query.graph({
    entity: "configurator",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "base_price",
      "product_id",
      "steps.id",
      "steps.title",
      "steps.order",
      "steps.options.id",
      "steps.options.name",
      "steps.options.description",
      "steps.options.price_modifier",
      "steps.options.parent_option_id",
      "steps.options.product_id",
      "steps.options.order",
      "steps.options.image_url",
    ],
    filters: {
      product_id: product_id as string,
    },
  })

  if (!configurators || configurators.length === 0) {
    return res.json({ configurator: null })
  }

  const configurator = configurators[0]

  // Get the base product price
  let basePrice = (configurator as any).base_price || 0
  if (product_id) {
    const { data: baseProducts } = await query.graph({
      entity: "product",
      fields: ["id", "variants.calculated_price.calculated_amount"],
      filters: { id: product_id as string },
      context: {
        variants: {
          calculated_price: QueryContext({
            currency_code: currency_code as string,
          }),
        },
      },
    }) as { data: ProductWithCalculatedPrice[] }
    if (baseProducts?.[0]?.variants?.[0]?.calculated_price) {
      basePrice = baseProducts[0].variants[0].calculated_price.calculated_amount || 0
    }
  }

  // Fetch component product details for all options
  const componentProductIds = (configurator as any).steps
    ?.flatMap((step: any) => step.options || [])
    .map((option: any) => option.product_id)
    .filter(Boolean)

  let componentProducts: ProductWithCalculatedPrice[] = []
  if (componentProductIds && componentProductIds.length > 0) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "variants.id", "variants.calculated_price.calculated_amount"],
      filters: {
        id: componentProductIds,
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            currency_code: currency_code as string,
          }),
        },
      },
    }) as { data: ProductWithCalculatedPrice[] }
    componentProducts = products || []
  }

  // Map component products to options
  const configuratorWithPrices = {
    ...configurator,
    base_price: basePrice,
    steps: (configurator as any).steps?.map((step: any) => ({
      ...step,
      options: step.options?.map((option: any) => {
        const componentProduct = componentProducts.find(
          (p) => p.id === option.product_id
        )
        
        let price = 0
        
        if (componentProduct?.variants?.[0]?.calculated_price) {
          price = componentProduct.variants[0].calculated_price.calculated_amount || 0
        }

        return {
          ...option,
          product: componentProduct ? {
            id: componentProduct.id,
            title: componentProduct.title,
            handle: componentProduct.handle,
          } : null,
          price,
        }
      }),
    })),
  }

  return res.json({ configurator: configuratorWithPrices })
}
