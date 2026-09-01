import { Thumbnail } from "@/components/ui/thumbnail"
import { Link } from "@tanstack/react-router"
import type { ProductHit } from "@/lib/search-client"

export type { ProductHit }

type SearchHitProps = {
  hit: ProductHit
  countryCode: string
  onNavigate: () => void
}

export const SearchHit = ({ hit, countryCode, onNavigate }: SearchHitProps) => {
  if (!hit.handle) {
    return null
  }

  return (
    <li>
      <Link
        to="/$countryCode/products/$handle"
        params={{ countryCode, handle: hit.handle }}
        onClick={onNavigate}
        className="flex items-center gap-x-4 px-6 py-3 hover:bg-zinc-50 transition-colors"
        data-testid="search-hit-link"
      >
        <Thumbnail
          thumbnail={hit.thumbnail}
          alt={hit.title ?? ""}
          className="w-14 h-16 flex-shrink-0"
        />
        <span className="text-sm text-[#0a0a0a] line-clamp-2">{hit.title}</span>
      </Link>
    </li>
  )
}
