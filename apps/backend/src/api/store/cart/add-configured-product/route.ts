import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"

type AddConfiguredProductBody = {
  cart_id: string
  product_id?: string
  variant_id: string
  quantity?: number
  configuration?: {
    selections?: Record<string, string>
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as AddConfiguredProductBody
  const { cart_id, product_id, variant_id, quantity = 1, configuration } = body
  
  if (!cart_id || !variant_id) {
    return res.status(400).json({ 
      error: "cart_id and variant_id are required" 
    })
  }

  // Calculate total price from configuration
  const query = req.scope.resolve("query")
  let totalPrice = 0
  const componentSkus: string[] = []
  
  if (configuration && configuration.selections) {
    const optionIds = Object.values(configuration.selections) as string[]
    
    if (optionIds.length > 0) {
      const { data: options } = await query.graph({
        entity: "configurator_option",
        fields: ["id", "name", "product_id"],
        filters: { id: optionIds }
      })
      
      const productIds = options.map((opt: any) => opt.product_id).filter(Boolean)
      
      if (productIds.length > 0) {
        const { data: products } = await query.graph({
          entity: "product",
          fields: ["id", "variants.*"],
          filters: { id: productIds }
        })
        
        products.forEach((product: any) => {
          if (product.variants?.[0]) {
            const variant = product.variants[0]
            componentSkus.push(variant.sku)
            
            // Get price from variant prices array
            const price = variant.prices?.[0]?.amount || 0
            totalPrice += Number(price)
          }
        })
      }
    }
  }

  // Add item to cart with metadata
  const { result } = await addToCartWorkflow(req.scope).run({
    input: {
      cart_id,
      items: [{
        variant_id,
        quantity,
        metadata: {
          configuration: configuration || {},
          component_skus: componentSkus,
          configured_price: totalPrice
        }
      }]
    }
  })

  return res.json({ 
    cart: result,
    configuration_total: totalPrice,
    component_skus: componentSkus
  })
}
