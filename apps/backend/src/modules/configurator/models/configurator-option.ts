import { model } from "@medusajs/framework/utils"
import ConfiguratorStep from "./configurator-step"

const ConfiguratorOption = model.define("configurator_option", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  image_url: model.text().nullable(),
  price_modifier: model.bigNumber().nullable(),
  order: model.number(),
  parent_option_id: model.text().nullable(),
  product_id: model.text().nullable(),
  
  step: model.belongsTo(() => ConfiguratorStep, {
    mappedBy: "options",
  }),
})

export default ConfiguratorOption
