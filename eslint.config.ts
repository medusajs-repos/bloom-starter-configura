import { defineConfig } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

// Shared base config for the monorepo. Workspaces extend this via a relative
// import (see apps/backend/eslint.config.ts). Keep this location-agnostic:
// avoid adding `ignores`/`files` globs tied to the repo root so they don't leak
// into extending configs.
export default defineConfig([...medusa.configs.recommended])
