import React from "react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8">
      <div className="inline-flex items-center gap-2 p-1.5 bg-white border border-neutral-200/80 rounded-2xl shadow-xs">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3.5 py-1.5 text-sm font-medium text-[#ff385c] hover:bg-rose-50 rounded-xl transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-xl text-sm font-medium flex items-center justify-center transition cursor-pointer ${
                  isActive
                    ? "bg-[#ff385c] text-white font-semibold shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3.5 py-1.5 text-sm font-medium text-[#ff385c] hover:bg-rose-50 rounded-xl transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
