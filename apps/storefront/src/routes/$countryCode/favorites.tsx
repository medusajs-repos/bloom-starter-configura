import { createFileRoute } from "@tanstack/react-router"
import { Heart } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/favorites")({
  component: FavoritesPage,
})

function FavoritesPage() {
  const { countryCode } = Route.useParams()

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                Your Favorites
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore your saved favorites here. Create an account or log in
                to save items across devices.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`/${countryCode}/account`}
                className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Log in
              </a>
              <button className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity">
                Share favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="max-w-7xl mx-auto px-8 py-24 md:py-32">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-w-md">
            <h2 className="text-2xl font-light tracking-tight">
              No favorites yet
            </h2>
            <p className="text-muted-foreground">
              Start exploring our collection and click the heart icon to save
              your favorite items here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={`/${countryCode}/store`}
              className="px-8 py-3 bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Browse Products
            </a>
            <a
              href={`/${countryCode}/account`}
              className="px-8 py-3 border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
