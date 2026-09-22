import Pagination from "@/components/ui/pagination"
import { usePagination } from "react-instantsearch"

export const SearchPagination = () => {
  const { currentRefinement, nbPages, refine } = usePagination()

  if (nbPages <= 1) {
    return null
  }

  return (
    <Pagination
      page={currentRefinement + 1}
      totalPages={nbPages}
      onPageChange={(page) => {
        refine(page - 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }}
      data-testid="search-pagination"
    />
  )
}
