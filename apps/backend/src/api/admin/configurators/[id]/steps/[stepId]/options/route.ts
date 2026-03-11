import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { stepId } = req.params
  const body = req.body as any
  const { name, description, order, image_url, price_modifier, parent_option_id, product_id } = body

  const option = await configuratorService.createConfiguratorOptions({
    name,
    description,
    order,
    image_url,
    price_modifier,
    parent_option_id,
    product_id,
    step_id: stepId,
  })

  return res.json({ option })
}
