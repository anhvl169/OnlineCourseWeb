import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Pagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange
}) {
    if (totalPages <= 1) return null;

    return (
        <nav className="mt-5">
            <ul className="pagination justify-content-center border-0">
                {/* Prev */}
                <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevPage}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(i + 1)}>
                            {i + 1}
                        </button>
                    </li>
                ))}
                {/* Next */}
                <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
}