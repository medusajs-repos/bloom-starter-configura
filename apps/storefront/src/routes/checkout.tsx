import { getStoredCountryCode } from "@/lib/data/country-code"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { CheckoutStepKey } from "@/lib/types/global"

export const Route = createFileRoute("/checkout")({
  loader: async () => {
    const { countryCode } = await getStoredCountryCode()

    throw redirect({
      to: "/$countryCode/checkout",
      search: { step: CheckoutStepKey.ADDRESSES },
      params: { countryCode },
    })
  },
})
