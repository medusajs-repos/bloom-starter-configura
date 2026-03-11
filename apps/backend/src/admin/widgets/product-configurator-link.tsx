import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button } from "@medusajs/ui"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { sdk } from "../lib/sdk"
import { AdminProduct } from "@medusajs/framework/types"

const ProductConfiguratorLinkWidget = ({ data }: { data: AdminProduct }) => {
  const [configurator, setConfigurator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfigurator = async () => {
      try {
        setIsLoading(true)
        const response = await sdk.client.fetch("/admin/configurators")
        const config = response.configurators?.find(
          (c: any) => c.product_id === data.id
        )
        setConfigurator(config)
      } catch (err) {
        console.error("Error loading configurator:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfigurator()
  }, [data.id])

  if (isLoading) {
    return null
  }

  if (!configurator) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Product Configurator</Heading>
          <p className="text-ui-fg-subtle text-sm mt-1">
            This product has an active configurator
          </p>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={() => window.location.href = `/app/configurators/${configurator.id}`}
        >
          <ArrowUpRightOnBox className="mr-1" />
          Manage Configurator
        </Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductConfiguratorLinkWidget
