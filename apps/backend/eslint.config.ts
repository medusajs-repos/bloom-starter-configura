import { defineConfig } from "eslint/config"
import base from "../../eslint.config"

export default defineConfig([
  {
    extends: [base],
    // backend-specific overrides go here
    rules: {},
  },
])
