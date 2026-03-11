import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  const { data: configurators } = await query.graph({
    entity: "configurator",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "is_active",
      "created_at",
      "updated_at",
      "steps.*",
      "steps.options.*",
    ],
    filters: { id },
  })

  if (!configurators || configurators.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Configurator with id ${id} not found`
    )
  }

  return res.json({ configurator: configurators[0] })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const { id } = req.params
  const body = req.body as any

  const configurator = await configuratorService.updateConfigurators({
    id,
    ...body,
  })

  return res.json({ configurator })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const configuratorService = req.scope.resolve("configurator")
  const query = req.scope.resolve("query")
  const { id } = req.params

  try {
    // First, get the configurator with all its steps and options
    const { data: configurators } = await query.graph({
      entity: "configurator",
      fields: ["id", "steps.*", "steps.options.*"],
      filters: { id },
    })

    if (configurators?.[0]) {
      const configurator = configurators[0]
      
      // Delete all options first
      for (const step of configurator.steps || []) {
        if (step.options?.length) {
          const optionIds = step.options.map((o: any) => o.id)
          await configuratorService.deleteConfiguratorOptions(optionIds)
        }
      }

      // Delete all steps
      if (configurator.steps?.length) {
        const stepIds = configurator.steps.map((s: any) => s.id)
        await configuratorService.deleteConfiguratorSteps(stepIds)
      }
    }

    // Finally delete the configurator
    await configuratorService.deleteConfigurators(id)
    return res.json({ id, deleted: true })
  } catch (error) {
    console.error("Error deleting configurator:", error)
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error.message || "Failed to delete configurator"
    )
  }
}
