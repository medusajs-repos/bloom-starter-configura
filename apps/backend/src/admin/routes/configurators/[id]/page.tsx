import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Label, Textarea, Table, Select } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { sdk } from "../../../lib/sdk"
import { Plus, Trash, PencilSquare } from "@medusajs/icons"

const ConfiguratorDetailPage = () => {
  const id = window.location.pathname.split("/").pop()
  const [configurator, setConfigurator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [formData, setFormData] = useState({ name: "", handle: "", description: "" })
  const [showStepForm, setShowStepForm] = useState(false)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [stepForm, setStepForm] = useState({ title: "", description: "", order: 0 })
  const [showOptionForm, setShowOptionForm] = useState<string | null>(null)
  const [editingOption, setEditingOption] = useState<any>(null)
  const [optionForm, setOptionForm] = useState({ name: "", description: "", order: 0, parent_option_id: "", product_id: "", price_modifier: 0 })
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    loadConfigurator()
    loadProducts()
  }, [id])

  const loadProducts = async () => {
    try {
      setLoadingProducts(true)
      const data = await sdk.client.fetch(`/admin/products?limit=100`) as any
      setProducts(data.products || [])
    } catch (err) {
      console.error("Failed to load products:", err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadConfigurator = async () => {
    try {
      setIsLoading(true)
      const data = await sdk.client.fetch(`/admin/configurators/${id}`) as any
      setConfigurator(data.configurator)
      setFormData({
        name: data.configurator.name,
        handle: data.configurator.handle,
        description: data.configurator.description || ""
      })
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      await sdk.client.fetch(`/admin/configurators/${id}`, {
        method: "POST",
        body: formData
      })
      alert("Configurator updated successfully!")
      loadConfigurator()
    } catch (err) {
      alert("Error updating configurator: " + (err as Error).message)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this configurator?")) {
      return
    }
    try {
      await sdk.client.fetch(`/admin/configurators/${id}`, {
        method: "DELETE"
      })
      window.location.href = "/app/configurators"
    } catch (err) {
      alert("Error deleting configurator: " + (err as Error).message)
    }
  }

  const handleAddStep = () => {
    setEditingStep(null)
    setStepForm({ title: "", description: "", order: (configurator?.steps?.length || 0) + 1 })
    setShowStepForm(true)
  }

  const handleEditStep = (step: any) => {
    setEditingStep(step)
    setStepForm({ title: step.title, description: step.description || "", order: step.order })
    setShowStepForm(true)
  }

  const handleSaveStep = async () => {
    try {
      if (editingStep) {
        await sdk.client.fetch(`/admin/configurators/${id}/steps/${editingStep.id}`, {
          method: "POST",
          body: stepForm,
        })
      } else {
        await sdk.client.fetch(`/admin/configurators/${id}/steps`, {
          method: "POST",
          body: stepForm,
        })
      }
      
      setShowStepForm(false)
      loadConfigurator()
    } catch (error) {
      alert("Failed to save step: " + (error as Error).message)
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Are you sure you want to delete this step?")) return

    try {
      await sdk.client.fetch(`/admin/configurators/${id}/steps/${stepId}`, {
        method: "DELETE",
      })
      
      loadConfigurator()
    } catch (error) {
      alert("Failed to delete step: " + (error as Error).message)
    }
  }

  const handleAddOption = (stepId: string) => {
    const step = configurator?.steps?.find((s: any) => s.id === stepId)
    setEditingOption(null)
    setOptionForm({ 
      name: "", 
      description: "", 
      order: (step?.options?.length || 0) + 1, 
      parent_option_id: "",
      product_id: "",
      price_modifier: 0
    })
    setShowOptionForm(stepId)
  }

  const handleEditOption = (option: any, stepId: string) => {
    setEditingOption(option)
    setOptionForm({ 
      name: option.name, 
      description: option.description || "", 
      order: option.order,
      parent_option_id: option.parent_option_id || "",
      product_id: option.product_id || "",
      price_modifier: option.price_modifier || 0
    })
    setShowOptionForm(stepId)
  }

  const handleSaveOption = async (stepId: string) => {
    try {
      if (editingOption) {
        await sdk.client.fetch(
          `/admin/configurators/${id}/steps/${stepId}/options/${editingOption.id}`, 
          {
            method: "POST",
            body: optionForm,
          }
        )
      } else {
        await sdk.client.fetch(`/admin/configurators/${id}/steps/${stepId}/options`, {
          method: "POST",
          body: optionForm,
        })
      }
      
      setShowOptionForm(null)
      loadConfigurator()
    } catch (error) {
      alert("Failed to save option: " + (error as Error).message)
    }
  }

  const handleDeleteOption = async (stepId: string, optionId: string) => {
    if (!confirm("Are you sure you want to delete this option?")) return

    try {
      await sdk.client.fetch(
        `/admin/configurators/${id}/steps/${stepId}/options/${optionId}`, 
        {
          method: "DELETE",
        }
      )
      
      loadConfigurator()
    } catch (error) {
      alert("Failed to delete option: " + (error as Error).message)
    }
  }

  if (isLoading) {
    return (
      <Container>
        <p className="text-ui-fg-subtle">Loading...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <p className="text-ui-fg-error">Error: {error.message}</p>
      </Container>
    )
  }

  const sortedSteps = [...(configurator?.steps || [])].sort((a: any, b: any) => a.order - b.order)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="flex items-center gap-4">
            {configurator?.base_product?.thumbnail && (
              <img 
                src={configurator.base_product.thumbnail} 
                alt={configurator.base_product.title}
                className="w-16 h-16 object-cover rounded border border-ui-border-base"
              />
            )}
            <div>
              <Heading level="h1">{configurator?.name}</Heading>
              <p className="text-ui-fg-subtle text-sm mt-1">{configurator?.handle}</p>
              {configurator?.base_product?.title && (
                <p className="text-ui-fg-muted text-xs mt-1">
                  Base Product: <span className="font-medium">{configurator.base_product.title}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="small" variant="secondary" onClick={() => window.location.href = "/app/configurators"}>
            Back
          </Button>
          <Button size="small" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-4 max-w-lg">
          <Heading level="h2">General Information</Heading>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button onClick={handleUpdate} disabled={!formData.name || !formData.handle}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2">Configuration Steps</Heading>
          <Button size="small" onClick={handleAddStep}>
            <Plus /> Add Step
          </Button>
        </div>

        {showStepForm && !editingStep && (
          <div className="border border-ui-border-base p-4 rounded mb-4 space-y-4 bg-ui-bg-subtle">
            <Heading level="h3">New Step</Heading>
            <div>
              <Label htmlFor="step-title">Title</Label>
              <Input
                id="step-title"
                value={stepForm.title}
                onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="step-description">Description</Label>
              <Textarea
                id="step-description"
                value={stepForm.description}
                onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="step-order">Display Order</Label>
              <Input
                id="step-order"
                type="number"
                value={stepForm.order}
                onChange={(e) => setStepForm({ ...stepForm, order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="small" onClick={handleSaveStep}>Save</Button>
              <Button size="small" variant="secondary" onClick={() => setShowStepForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {sortedSteps.map((step: any) => {
          const sortedOptions = [...(step.options || [])].sort((a: any, b: any) => a.order - b.order)
          
          return (
            <div key={step.id} className="border border-ui-border-base p-4 rounded mb-4 space-y-4">
              {editingStep?.id === step.id ? (
                <div className="space-y-4 bg-ui-bg-subtle p-4 rounded">
                  <Heading level="h3">Edit Step</Heading>
                  <div>
                    <Label htmlFor={`step-title-${step.id}`}>Title</Label>
                    <Input
                      id={`step-title-${step.id}`}
                      value={stepForm.title}
                      onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-description-${step.id}`}>Description</Label>
                    <Textarea
                      id={`step-description-${step.id}`}
                      value={stepForm.description}
                      onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`step-order-${step.id}`}>Display Order</Label>
                    <Input
                      id={`step-order-${step.id}`}
                      type="number"
                      value={stepForm.order}
                      onChange={(e) => setStepForm({ ...stepForm, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" onClick={handleSaveStep}>Save</Button>
                    <Button size="small" variant="secondary" onClick={() => { setEditingStep(null); setShowStepForm(false) }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <Heading level="h3">
                      {step.order}. {step.title}
                    </Heading>
                    {step.description && <p className="text-sm text-ui-fg-subtle">{step.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="small" variant="transparent" onClick={() => handleEditStep(step)}>
                      <PencilSquare />
                    </Button>
                    <Button size="small" variant="transparent" onClick={() => handleDeleteStep(step.id)}>
                      <Trash />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button size="small" onClick={() => handleAddOption(step.id)}>
                    <Plus /> Add Option
                  </Button>
                </div>

                {showOptionForm === step.id && (
                  <div className="border border-ui-border-base p-3 rounded space-y-3 bg-ui-bg-subtle-hover">
                    <Heading level="h3">{editingOption ? "Edit Option" : "New Option"}</Heading>
                    <div>
                      <Label htmlFor="option-name">Name</Label>
                      <Input
                        id="option-name"
                        value={optionForm.name}
                        onChange={(e) => setOptionForm({ ...optionForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="option-description">Description</Label>
                      <Input
                        id="option-description"
                        value={optionForm.description}
                        onChange={(e) => setOptionForm({ ...optionForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="option-order">Display Order</Label>
                      <Input
                        id="option-order"
                        type="number"
                        value={optionForm.order}
                        onChange={(e) => setOptionForm({ ...optionForm, order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parent-option">Parent Option ID (for conditional display)</Label>
                      <Input
                        id="parent-option"
                        value={optionForm.parent_option_id}
                        onChange={(e) => setOptionForm({ ...optionForm, parent_option_id: e.target.value })}
                        placeholder="Leave empty for top-level options"
                      />
                      <p className="text-xs text-ui-fg-subtle mt-1">
                        Options with a parent ID will only show when that parent option is selected
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="product-id">Component Product</Label>
                      <Select
                        value={optionForm.product_id}
                        onValueChange={(value) => setOptionForm({ ...optionForm, product_id: value })}
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Select a product" />
                        </Select.Trigger>
                        <Select.Content>
                          {products.map(product => (
                            <Select.Item key={product.id} value={product.id}>
                              {product.title}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                      <p className="text-xs text-ui-fg-subtle mt-1">
                        Link this option to a component product for pricing and inventory.
                        {configurator?.base_product?.title && (
                          <> Tip: Name component products like "{configurator.base_product.title} - [Option Name]" to keep them organized.</>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="small" onClick={() => handleSaveOption(step.id)}>Save</Button>
                      <Button size="small" variant="secondary" onClick={() => setShowOptionForm(null)}>Cancel</Button>
                    </div>
                  </div>
                )}

                {sortedOptions.length > 0 ? (
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Display Order</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Component Product</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {sortedOptions.map((option: any) => {
                        const linkedProduct = products.find(p => p.id === option.product_id)
                        return (
                          <Table.Row key={option.id}>
                            <Table.Cell>{option.order}</Table.Cell>
                            <Table.Cell>{option.name}</Table.Cell>
                            <Table.Cell>{option.description || "-"}</Table.Cell>
                            <Table.Cell>
                              {linkedProduct ? (
                                <span className="text-sm">{linkedProduct.title}</span>
                              ) : (
                                <span className="text-xs text-ui-fg-subtle">No product linked</span>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-2">
                                <Button size="small" variant="transparent" onClick={() => handleEditOption(option, step.id)}>
                                  <PencilSquare />
                                </Button>
                                <Button size="small" variant="transparent" onClick={() => handleDeleteOption(step.id, option.id)}>
                                  <Trash />
                                </Button>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table>
                ) : (
                  <p className="text-sm text-ui-fg-subtle">No options yet</p>
                )}
              </div>
            </div>
          )
        })}

        {sortedSteps.length === 0 && !showStepForm && (
          <p className="text-ui-fg-subtle">No steps configured yet. Add your first step above.</p>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Configurator Details"
})

export default ConfiguratorDetailPage
