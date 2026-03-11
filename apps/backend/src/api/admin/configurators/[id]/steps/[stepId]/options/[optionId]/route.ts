import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { optionId } = req.params
  const body = req.body as any

  const option = await configuratorService.updateConfiguratorOptions({
    id: optionId,
    ...body,
  })

  return res.json({ option })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { optionId } = req.params

  await configuratorService.deleteConfiguratorOptions(optionId)

  return res.json({ id: optionId, deleted: true })
}
