import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id: cart_id } = req.params
  const body = req.body as {
    variant_id: string
    quantity?: number
    configuration: Record<string, string>
    configured_price: number
    configuration_details?: Array<{
      stepName: string
      optionName: string
      price: number
    }>
  }

  const { variant_id, quantity, configuration, configured_price, configuration_details } = body

  // Transform configuration_details to use snake_case field names
  const configuration_summary = configuration_details
    ? configuration_details.map((detail) => ({
        step_name: detail.stepName,
        option_name: detail.optionName,
        price: detail.price,
      }))
    : []

  // Use the add to cart workflow with metadata and unit_price override
  const { result } = await addToCartWorkflow(req.scope).run({
    input: {
      cart_id,
      items: [
        {
          variant_id,
          quantity: quantity || 1,
          unit_price: configured_price,
          metadata: {
            configuration,
            configured_price,
            configuration_summary,
          },
        },
      ],
    },
  })

  res.json({ cart: result })
}
