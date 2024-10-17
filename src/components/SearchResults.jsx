import React, { useEffect, useState } from "react";
import "./SearchResults.css"; // Add your CSS for styling
import { motion } from "framer-motion";

function SearchResults({ query, category, page, setPage }) {
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const resultsPerPage = 10; // Set the number of results per page
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/items/search?query=${query}&category=${category}`
            );
            const data = await response.json();
            setResults(data);
            setTotalResults(data.length); // Set total results (or modify to return total count from API)
        };

        fetchResults();
    }, [query, category]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Calculate the indices for pagination
    const startIndex = (page - 1) * resultsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + resultsPerPage);

    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const maxPages = 10; // Limit to 10 pages max
    const startPage = Math.max(1, page - 4);
    const endPage = Math.min(totalPages, page + 5);

    return (
        <div className="search-results-container">
            {query !== "" ? <h2>Search Results</h2> : <p>Search results will show up here</p>}
            {paginatedResults.length === 0 ? (
                query !== "" ? <p>No results found.</p> : null
            ) : (
                paginatedResults.map((item) => (
                    <motion.div
                        key={item._id} // Assuming each item has a unique _id
                        className="search-result-item"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3>{item.name}</h3>
                        <p>Category: {item.category}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                    </motion.div>
                ))
            )}

            {/* Pagination Controls */}
            <div className="pagination-controls">
                {startPage > 1 && (
                    <>
                        <button onClick={() => handlePageChange(1)}>1</button>
                        {startPage > 2 && <span>...</span>}
                    </>
                )}

                {Array.from({ length: Math.min(maxPages, endPage - startPage + 1) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={page === startPage + index ? "active" : ""}
                    >
                        {startPage + index}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span>...</span>}
                        <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
