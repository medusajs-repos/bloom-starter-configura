import { MiddlewareRoute, validateAndTransformBody } from "@medusajs/framework"
import { z } from "@medusajs/framework/zod"

const ConfiguratorOptionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  price_modifier: z.number().optional(),
  order: z.number(),
})

const ConfiguratorStepSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  image_url: z.string().optional(),
  options: z.array(ConfiguratorOptionSchema),
})

const CreateConfiguratorSchema = z.object({
  name: z.string(),
  handle: z.string(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  product_id: z.string(),
  steps: z.array(ConfiguratorStepSchema).optional(),
})

const UpdateConfiguratorSchema = z.object({
  name: z.string().optional(),
  handle: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
})

export const adminConfiguratorMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/configurators",
    method: "POST",
    middlewares: [validateAndTransformBody(CreateConfiguratorSchema)],
  },
  {
    matcher: "/admin/configurators/:id",
    method: "POST",
    middlewares: [validateAndTransformBody(UpdateConfiguratorSchema)],
  },
]
