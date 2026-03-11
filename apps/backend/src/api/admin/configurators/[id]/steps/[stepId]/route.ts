import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { stepId } = req.params
  const body = req.body as any

  const step = await configuratorService.updateConfiguratorSteps({
    id: stepId,
    ...body,
  })

  return res.json({ step })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { stepId } = req.params

  await configuratorService.deleteConfiguratorSteps(stepId)

  return res.json({ id: stepId, deleted: true })
}
