import React from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const firstPages = Array.from(
        { length: Math.min(3, totalPages) },
        (_, i) => i + 1
    );

    const lastPages = Array.from(
        { length: Math.max(totalPages - 3, 0) },
        (_, i) => totalPages - i
    ).reverse();

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const prevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const goToPage = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-between mt-6 pb-1">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-5 py-2 text-sm capitalize transition-colors duration-200 border rounded-md gap-x-2 select-none ${currentPage === 1
                    ? "bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 cursor-not-allowed"
                    : "bg-white text-gray-700 cursor-pointer hover:bg-gray-100 dark:bg-zinc-950 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-zinc-950/2"
                    }`}
            >
                <span>Previo</span>
            </button>

            <div className="items-center hidden md:flex gap-x-3">
                {firstPages.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2 py-1 text-sm rounded-md cursor-pointer ${currentPage === page
                            ? "text-white-600 bg-blue-100 dark:bg-zinc-800"
                            : "text-gray-500 dark:hover:bg-zinc-800 dark:text-gray-300 hover:bg-gray-100 dark:bg-zinc-950"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {totalPages > 6 && currentPage > 3 && currentPage < totalPages - 2 && <span>...</span>}

                {totalPages > 6 && currentPage > 3 && currentPage < totalPages - 2 && (
                    <button
                        key={currentPage}
                        onClick={() => goToPage(currentPage)}
                        className="px-2 py-1 text-sm rounded-md cursor-pointer text-blue-600 bg-blue-100 dark:bg-zinc-950"
                    >
                        {currentPage}
                    </button>
                )}

                {totalPages > 6 && <span>...</span>}

                {lastPages.map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2 py-1 text-sm rounded-md cursor-pointer ${currentPage === page
                            ? "text-white-600 bg-blue-100 dark:bg-zinc-800"
                            : "text-gray-500 dark:hover:bg-zinc-800 dark:text-gray-300 hover:bg-gray-100 dark:bg-zinc-950"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-5 py-2 text-sm capitalize transition-colors duration-200 border rounded-md gap-x-2 select-none ${currentPage === totalPages
                    ? "bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 cursor-not-allowed"
                    : "bg-white text-gray-700 cursor-pointer hover:bg-gray-100 dark:bg-zinc-950 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-zinc-950/2"
                    }`}
            >
                <span>Siguiente</span>
            </button>
        </div>
    );
};

export default Pagination;
