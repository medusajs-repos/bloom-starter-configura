import { model } from "@medusajs/framework/utils"
import Configurator from "./configurator"
import ConfiguratorOption from "./configurator-option"

const ConfiguratorStep = model.define("configurator_step", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text().nullable(),
  order: model.number(),
  image_url: model.text().nullable(),
  
  configurator: model.belongsTo(() => Configurator, {
    mappedBy: "steps",
  }),
  
  options: model.hasMany(() => ConfiguratorOption, {
    mappedBy: "step",
  }),
})

export default ConfiguratorStep
