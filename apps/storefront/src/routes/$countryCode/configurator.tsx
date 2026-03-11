import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const Route = createFileRoute("/$countryCode/configurator")({
  component: ConfiguratorLanding,
})

function ConfiguratorLanding() {
  const { countryCode } = Route.useParams()
  const navigate = useNavigate()

  const { data: configurators, isLoading } = useQuery({
    queryKey: ["configurators-list"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        configurators: Array<{ id: string; product_handle: string }>
      }>(`/store/configurators/list`, { method: "GET" })
      return response.configurators
    },
  })

  useEffect(() => {
    if (configurators && configurators.length > 0) {
      const first = configurators[0]
      navigate({
        to: "/$countryCode/products/$handle/configure",
        params: { countryCode, handle: first.product_handle },
      })
    }
  }, [configurators, countryCode, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading configurator...</p>
        </div>
      </div>
    )
  }

  if (!configurators || configurators.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-semibold mb-4">No Configurator Available</h1>
          <p className="text-gray-600">
            No configurator has been set up yet. You can create one in the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  return null
}
