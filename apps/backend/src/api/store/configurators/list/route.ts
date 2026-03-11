import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query")

  const { data: configurators } = await query.graph({
    entity: "configurator",
    fields: ["id", "name", "handle", "description", "product_id", "is_active"],
    filters: { is_active: true },
  })

  const productIds = configurators.map((c: any) => c.product_id).filter(Boolean)

  let productsMap: Record<string, string> = {}
  if (productIds.length > 0) {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: { id: productIds },
    })
    productsMap = (products || []).reduce((acc: any, p: any) => {
      acc[p.id] = p.handle
      return acc
    }, {})
  }

  const result = configurators.map((c: any) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
    description: c.description,
    product_id: c.product_id,
    product_handle: productsMap[c.product_id] || null,
  }))

  return res.json({ configurators: result })
}
