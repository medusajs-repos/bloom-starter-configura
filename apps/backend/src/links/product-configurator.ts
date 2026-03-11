import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ConfiguratorModule from "../modules/configurator"

export default defineLink(
  ProductModule.linkable.product,
  ConfiguratorModule.linkable.configurator
)
