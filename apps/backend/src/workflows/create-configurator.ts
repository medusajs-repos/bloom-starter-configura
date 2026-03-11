import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

type CreateConfiguratorInput = {
  name: string
  handle: string
  description?: string
  product_id?: string
  is_active?: boolean
  steps?: Array<{
    title: string
    description?: string
    order: number
    image_url?: string
    options: Array<{
      name: string
      description?: string
      image_url?: string
      price_modifier?: number
      order: number
    }>
  }>
}

const createConfiguratorStep = createStep(
  "create-configurator",
  async (input: CreateConfiguratorInput, { container }) => {
    const configuratorService = container.resolve("configurator")

    const configurator = await configuratorService.createConfigurators({
      name: input.name,
      handle: input.handle,
      description: input.description,
      product_id: input.product_id,
      is_active: input.is_active ?? true,
    })

    return new StepResponse(configurator, configurator.id)
  },
  async (configuratorId, { container }) => {
    if (!configuratorId) return
    const configuratorService = container.resolve("configurator")
    await configuratorService.deleteConfigurators(configuratorId)
  }
)

const createConfiguratorStepsStep = createStep(
  "create-configurator-steps",
  async (
    input: {
      configurator_id: string
      steps: CreateConfiguratorInput["steps"]
    },
    { container }
  ) => {
    if (!input.steps || input.steps.length === 0) {
      return new StepResponse([], [])
    }

    const configuratorService = container.resolve("configurator")

    const stepsData = input.steps.map((step) => ({
      configurator: { id: input.configurator_id },
      title: step.title,
      description: step.description,
      order: step.order,
      image_url: step.image_url,
    }))

    const createdSteps = await configuratorService.createConfiguratorSteps(
      stepsData
    )

    const optionsData = input.steps.flatMap((step, stepIndex) =>
      step.options.map((option) => ({
        step: { id: createdSteps[stepIndex].id },
        name: option.name,
        description: option.description,
        image_url: option.image_url,
        price_modifier: option.price_modifier,
        order: option.order,
      }))
    )

    const createdOptions = await configuratorService.createConfiguratorOptions(
      optionsData
    )

    return new StepResponse(
      { steps: createdSteps, options: createdOptions },
      { stepIds: createdSteps.map((s) => s.id), optionIds: createdOptions.map((o) => o.id) }
    )
  },
  async (data, { container }) => {
    const configuratorService = container.resolve("configurator")
    if (data.optionIds.length > 0) {
      await configuratorService.deleteConfiguratorOptions(data.optionIds)
    }
    if (data.stepIds.length > 0) {
      await configuratorService.deleteConfiguratorSteps(data.stepIds)
    }
  }
)

export const createConfiguratorWorkflow = createWorkflow(
  "create-configurator",
  function (input: CreateConfiguratorInput) {
    const configurator = createConfiguratorStep(input)

    const stepsAndOptions = createConfiguratorStepsStep({
      configurator_id: configurator.id,
      steps: input.steps,
    })

    return new WorkflowResponse({
      configurator,
      steps: stepsAndOptions.steps,
      options: stepsAndOptions.options,
    })
  }
)
