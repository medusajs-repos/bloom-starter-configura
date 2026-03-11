import Inspiration from "@/pages/inspiration"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$countryCode/inspiration")({
  head: () => {
    const title = "Inspiration | Configura"
    const description =
      "Discover the philosophy behind Configura — precision-engineered executive office chairs built for performance, comfort, and lasting quality."

    return {
      meta: [
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: title,
        },
        {
          property: "twitter:description",
          content: description,
        },
      ],
      title,
    }
  },
  component: Inspiration,
})
