import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Label, Textarea, Select } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { sdk } from "../../lib/sdk"

const ConfiguratorsPage = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", handle: "", description: "", product_id: "" })
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    loadData()
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await sdk.client.fetch("/admin/products?limit=100")
      // Filter out component products - only show base products
      const baseProducts = (response.products || []).filter(
        (p: any) => !p.metadata?.is_component
      )
      setProducts(baseProducts)
    } catch (err) {
      console.error("Error loading products:", err)
    }
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await sdk.client.fetch("/admin/configurators")
      setData(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateConfigurator = async () => {
    try {
      await sdk.client.fetch("/admin/configurators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData
      })
      setShowForm(false)
      setFormData({ name: "", handle: "", description: "", product_id: "" })
      loadData()
    } catch (err) {
      alert("Error creating configurator: " + (err as Error).message)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Product Configurators</Heading>
        <Button size="small" variant="secondary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Configurator"}
        </Button>
      </div>

      {showForm && (
        <div className="px-6 py-4 bg-ui-bg-subtle">
          <div className="space-y-4 max-w-lg">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., T-Shirt Configurator"
              />
            </div>
            <div>
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="e.g., tshirt-config"
              />
            </div>
            <div>
              <Label htmlFor="product">Main Product</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <Select.Trigger id="product">
                  <Select.Value placeholder="Select a product" />
                </Select.Trigger>
                <Select.Content>
                  {products.map((product) => (
                    <Select.Item key={product.id} value={product.id}>
                      {product.title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <Button onClick={handleCreateConfigurator} disabled={!formData.name || !formData.handle || !formData.product_id}>
              Create
            </Button>
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        {isLoading ? (
          <p className="text-ui-fg-subtle">Loading...</p>
        ) : error ? (
          <p className="text-ui-fg-error">Error: {error.message}</p>
        ) : data?.configurators?.length > 0 ? (
          <div className="divide-y">
            {data.configurators.map((config: any) => (
              <div key={config.id} className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-medium">{config.name}</h3>
                  <p className="text-ui-fg-subtle text-sm">{config.handle}</p>
                  <p className="text-ui-fg-muted text-xs mt-1">
                    {config.steps?.length || 0} steps
                  </p>
                </div>
                <Button size="small" variant="secondary" onClick={() => window.location.href = `/app/configurators/${config.id}`}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ui-fg-subtle">No configurators yet. Create your first one.</p>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Configurators"
})

export default ConfiguratorsPage
