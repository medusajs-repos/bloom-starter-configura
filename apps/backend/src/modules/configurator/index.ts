import ConfiguratorModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export default Module("configurator", {
  service: ConfiguratorModuleService,
})

export * from "./models/configurator"
export * from "./models/configurator-step"
export * from "./models/configurator-option"
