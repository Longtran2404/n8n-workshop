import React from "react";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav className="flex justify-center gap-2 mt-6" aria-label="Pagination">
      <button
        className="px-3 py-2 border rounded-lg text-sm font-medium disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Trước
      </button>
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          className={`px-3 py-2 border rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-neutral-200' : ''}`}
          onClick={() => onPageChange(i + 1)}
          aria-current={page === i + 1 ? 'page' : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-2 border rounded-lg text-sm font-medium disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
      >
        Sau
      </button>
    </nav>
  );
}
