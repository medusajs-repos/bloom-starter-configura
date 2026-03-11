import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createConfiguratorWorkflow } from "../../../workflows/create-configurator"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const query = req.scope.resolve("query")

  const { data: configurators } = await query.graph({
    entity: "configurator",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "is_active",
      "product_id",
      "created_at",
      "updated_at",
      "steps.*",
      "steps.options.*",
    ],
  })

  return res.json({ configurators })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as any
  const { result } = await createConfiguratorWorkflow(req.scope).run({
    input: body,
  })

  return res.json({ configurator: result })
}
