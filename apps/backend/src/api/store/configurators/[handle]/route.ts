import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const pricingContext = {
    currency_code: req.query?.currency_code as string || "gbp",
    region_id: req.query?.region_id as string,
  }
  const query = req.scope.resolve("query")
  const { handle } = req.params

  const { data: configurators } = await query.graph({
    entity: "configurator",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "is_active",
      "steps.*",
      "steps.options.*",
    ],
    filters: { 
      handle,
      is_active: true
    },
  })

  if (!configurators || configurators.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Configurator with handle ${handle} not found`
    )
  }

  // Sort steps and options by order
  const configurator = configurators[0]
  if (configurator.steps) {
    configurator.steps.sort((a: any, b: any) => a.order - b.order)
    
    // Fetch product details for each option
    const productIds = configurator.steps
      .flatMap((step: any) => step.options || [])
      .map((opt: any) => opt.product_id)
      .filter(Boolean)
    
    let productsMap: Record<string, any> = {}
    
    if (productIds.length > 0) {
      const { data: products } = await query.graph({
        entity: "product",
        fields: [
          "id",
          "title",
          "handle",
          "thumbnail",
          "variants.*",
          "variants.calculated_price.*"
        ],
        filters: { id: productIds },
        context: {
          variants: {
            calculated_price: pricingContext
          }
        }
      })
      
      productsMap = (products || []).reduce((acc: any, p: any) => {
        acc[p.id] = p
        return acc
      }, {})
    }
    
    // Attach product data to options
    configurator.steps.forEach((step: any) => {
      if (step.options) {
        step.options.sort((a: any, b: any) => a.order - b.order)
        step.options.forEach((option: any) => {
          if (option.product_id && productsMap[option.product_id]) {
            const product = productsMap[option.product_id]
            const productPrice = product.variants?.[0]?.calculated_price?.calculated_amount || 0
            
            option.product = {
              id: product.id,
              title: product.title,
              handle: product.handle,
              thumbnail: product.thumbnail,
              price: productPrice,
              sku: product.variants?.[0]?.sku
            }
            
            // Set the option price from the component product
            option.price = productPrice
          }
        })
      }
    })
  }

  return res.json({ configurator })
}
