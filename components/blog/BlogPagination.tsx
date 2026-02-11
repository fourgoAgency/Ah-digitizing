type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-sm text-slate-500 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {"<"}
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-[#dfe3ea] bg-white text-slate-500 hover:text-primary"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-sm text-slate-500 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {">"}
      </button>
    </nav>
  );
}
