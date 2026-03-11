import Layout from "@/components/layout"
import { listRegions } from "@/lib/data/regions"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { lazy, useEffect } from "react"
import appCss from "@/styles/app.css?url"
import { sdk } from "@/lib/utils/sdk"

const NotFound = lazy(() => import("@/components/not-found"))

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async ({ context }) => {
    const { queryClient } = context
    
    // Pre-populate regions cache
    await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions({ fields: "id, name, currency_code, *countries" }),
    })
    
    return {}
  },
  head: () => ({
    links: [
      { rel: "icon", href: "/images/medusa.svg" },
      { rel: "stylesheet", href: appCss },
    ],
    meta: [
      { title: "Medusa Storefront" },
      { charSet: "UTF-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  useEffect(() => {
    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (
        error?.message &&
        typeof error.message === "string" &&
        error.message.includes("Customer with id:") &&
        error.message.includes("was not found")
      ) {
        console.warn("Detected deleted customer session, logging out...")
        event.preventDefault()
        await sdk.auth.logout()
        window.location.reload()
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  )
}
