import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { sanitize } from "@/lib/utils/sanitize"

export const Route = createFileRoute("/$countryCode/account")({
  component: AccountLayout,
  beforeLoad: async ({ params }) => {
    try {
      const { customer } = await sdk.store.customer.retrieve()
      return sanitize({ customer })
    } catch (error) {
      throw redirect({ to: "/$countryCode/login", params })
    }
  },
})

function AccountLayout() {
  const navigate = useNavigate()
  const { countryCode } = Route.useParams()
  const { customer } = Route.useRouteContext()

  const handleLogout = async () => {
    await sdk.auth.logout()
    navigate({ to: "/$countryCode", params: { countryCode } })
  }

  return (
    <div className="min-h-[calc(100vh-200px)] px-4 py-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">My Account</h1>
        <p className="text-gray-600">
          {customer.first_name} {customer.last_name} ({customer.email})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="space-y-2">
            <Link
              to="/$countryCode/account"
              params={{ countryCode }}
              className="block px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              activeProps={{ className: "bg-gray-100 font-medium" }}
            >
              Profile
            </Link>
            <Link
              to="/$countryCode/account/orders"
              params={{ countryCode }}
              className="block px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              activeProps={{ className: "bg-gray-100 font-medium" }}
            >
              Orders
            </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors text-red-600"
          >
            Logout
          </button>
        </nav>

        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
