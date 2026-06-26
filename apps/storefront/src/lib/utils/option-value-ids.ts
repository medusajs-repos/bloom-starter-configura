/**
 * Utilities for the global product-option filter URL parameter.
 *
 * The product list page exposes a query-string parameter (see
 * `OPTION_VALUE_QUERY_KEY`) that lets users filter products by one or more
 * global product option values. The same param shape is consumed both on the
 * client (`URLSearchParams` from the browser location) and on the server
 * (the plain `searchParams` record TanStack Start gives loaders).
 */

export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

type ServerSearchParams = Record<
  string,
  string | string[] | undefined
>

/**
 * Parses option value IDs from URL search params.
 *
 * Accepts either a `URLSearchParams` instance (client-side `window.location`)
 * or a plain `Record` (server-side route loader `search`). Supports both
 * repeated keys (`?optionValueIds=a&optionValueIds=b`) and comma-separated
 * fallbacks (`?optionValueIds=a,b`). Returned ids are deduped and trimmed.
 */
export const parseOptionValueIds = (
  input: URLSearchParams | ServerSearchParams | undefined | null
): string[] => {
  if (!input) {
    return []
  }

  const raw: string[] = []

  if (typeof URLSearchParams !== "undefined" && input instanceof URLSearchParams) {
    raw.push(...input.getAll(OPTION_VALUE_QUERY_KEY))
  } else {
    const value = (input as ServerSearchParams)[OPTION_VALUE_QUERY_KEY]
    if (Array.isArray(value)) {
      raw.push(...value)
    } else if (typeof value === "string") {
      raw.push(value)
    }
  }

  const flattened = raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean)

  return Array.from(new Set(flattened))
}
