import Button from "./Button";

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  onPrevious,
  onNext,
}) {
  const getPageNumbers = () => {
    // Small number of pages
    if (lastPage <= 7) {
      return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = [];

    // Near beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", lastPage];
    }

    // Near end
    if (currentPage >= lastPage - 3) {
      return [
        1,
        "...",
        lastPage - 4,
        lastPage - 3,
        lastPage - 2,
        lastPage - 1,
        lastPage,
      ];
    }

    // Middle
    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      lastPage,
    );

    return pages;
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Results */}
      <p className="text-sm text-stone-500">
        Page <span className="font-semibold text-stone-700">{currentPage}</span>{" "}
        of <span className="font-semibold text-stone-700">{lastPage}</span>
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={onPrevious}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-sm text-stone-400"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`h-9 min-w-9 rounded-md px-2.5 text-sm font-semibold transition ${
                  currentPage === pageNumber
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <Button
          variant="secondary"
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
