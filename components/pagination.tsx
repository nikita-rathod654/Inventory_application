import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const btnBase =
    "inline-flex h-10 items-center justify-center gap-1 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] sm:px-4";
  const btnActive =
    "border border-[#1B1635]/15 bg-white text-[#1B1635] hover:bg-[#1B1635]/[0.04]";
  const btnDisabled =
    "cursor-not-allowed border border-transparent bg-[#1B1635]/[0.04] text-[#1B1635]/30";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 sm:justify-center sm:gap-1.5"
    >
      {/* Previous */}
      {isFirst ? (
        <span aria-disabled="true" className={`${btnBase} ${btnDisabled}`}>
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-label="Previous page"
          className={`${btnBase} ${btnActive}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      )}

      {/* Mobile: compact "Page X of Y" */}
      <p className="text-sm text-[#1B1635]/65 sm:hidden">
        Page <span className="font-semibold text-[#1B1635]">{currentPage}</span>{" "}
        of {totalPages}
      </p>

      {/* Tablet / desktop: page numbers */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {visiblePages.map((page, key) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${key}`}
                className="px-2 text-sm text-[#1B1635]/45"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={getPageUrl(pageNumber)}
              aria-current={isCurrentPage ? "page" : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] ${
                isCurrentPage
                  ? "bg-[#5B3FD9] text-white shadow-md shadow-[#5B3FD9]/25"
                  : "border border-[#1B1635]/15 bg-white text-[#1B1635] hover:bg-[#1B1635]/[0.04]"
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {isLast ? (
        <span aria-disabled="true" className={`${btnBase} ${btnDisabled}`}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-label="Next page"
          className={`${btnBase} ${btnActive}`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}