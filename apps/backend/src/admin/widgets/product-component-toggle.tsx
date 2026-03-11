import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Label, Switch, Text } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../lib/client"
import type { AdminProduct } from "@medusajs/framework/types"

const ProductComponentToggle = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const isComponent = data.metadata?.is_component === true

  const { mutate: toggleComponent, isPending } = useMutation({
    mutationFn: async (checked: boolean) => {
      return sdk.admin.product.update(data.id, {
        metadata: {
          ...data.metadata,
          is_component: checked,
        },
      })
    },
    onSuccess: () => {
      window.location.reload()
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Settings</Heading>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="is_component" weight="plus">
              Component Product
            </Label>
            <Text size="small" className="text-ui-fg-subtle">
              Component products are hidden from regular product listings and
              only used in configurators
            </Text>
          </div>
          <Switch
            id="is_component"
            checked={isComponent}
            disabled={isPending}
            onCheckedChange={toggleComponent}
          />
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductComponentToggle
