import { MedusaService } from "@medusajs/framework/utils"
import Configurator from "./models/configurator"
import ConfiguratorStep from "./models/configurator-step"
import ConfiguratorOption from "./models/configurator-option"

class ConfiguratorModuleService extends MedusaService({
  Configurator,
  ConfiguratorStep,
  ConfiguratorOption,
}) {}

export default ConfiguratorModuleService
