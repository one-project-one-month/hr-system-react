import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (rows: number) => void;
    totalRows: number;
}

export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    totalRows,
}: PaginationProps) {
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    const goToFirst = () => onPageChange(1);
    const goPrev = () => onPageChange(Math.max(currentPage - 1, 1));
    const goNext = () => onPageChange(Math.min(currentPage + 1, totalPages));
    const goToLast = () => onPageChange(totalPages);

    return (
        <div className="w-full flex items-center justify-center md:justify-around border-t flex-col md:flex-row gap-3 ">
            {/* Left: Showing rows */}
            <div className="text-sm text-muted-foreground">
                {startRow}–{endRow} of {totalRows}
            </div>
            {/* Middle: Page buttons */}
            <div className="flex space-x-1">
                <button
                    onClick={goToFirst}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
                >
                    <ChevronsLeft />
                </button>
                <button
                    onClick={goPrev}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
                >
                    <ChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded ${
                                page === currentPage
                                    ? "bg-primary-500 text-natural-50"
                                    : "bg-natural-50 text-black hover:bg-gray-200"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
                <button
                    onClick={goNext}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
                >
                    <ChevronRight />
                </button>
                <button
                    onClick={goToLast}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
                >
                    <ChevronsRight />
                </button>
            </div>
            {/* Right: Rows per page */}
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Rows/page:
                </span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => {
                        onRowsPerPageChange(Number(e.target.value));
                    }}
                    className="border rounded px-2 py-1 text-sm p-3"
                >
                    {[10, 20, 30, 50].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
