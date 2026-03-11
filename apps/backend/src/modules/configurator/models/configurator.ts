import { model } from "@medusajs/framework/utils"
import ConfiguratorStep from "./configurator-step"

const Configurator = model.define("configurator", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
  description: model.text().nullable(),
  is_active: model.boolean().default(true),
  product_id: model.text().nullable(),
  base_price: model.bigNumber().nullable(),
  
  steps: model.hasMany(() => ConfiguratorStep, {
    mappedBy: "configurator",
  }),
})

export default Configurator
