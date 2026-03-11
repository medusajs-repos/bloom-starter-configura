import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { id } = req.params
  const body = req.body as any
  const { title, description, order, image_url } = body

  const step = await configuratorService.createConfiguratorSteps({
    title,
    description,
    order,
    image_url,
    configurator_id: id,
  })

  return res.json({ step })
}
