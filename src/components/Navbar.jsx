import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // Optional CSS for navbar styling
import { FaUser } from "react-icons/fa";

function Navbar({ isLoggedIn, onLogout, setSearchQuery, setCategoryFilter }) {
    const location = useLocation(); // Get the current route
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [categories, setCategories] = useState([]); // State to hold categories
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    // const BACKEND_URL = "http://localhost:8000";
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/categories`);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json();
                setCategories(data); // Set the categories state
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories(); // Call fetchCategories when component mounts
    }, []);

    // Conditional styling or class based on the current route
    const navbarClass = location.pathname === "/" ? "navbar navbar-transparent" : "navbar";

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm); // Update the search query in the parent component
        setCategoryFilter(category); // Update the category filter in the parent component
    };

    return (
        <nav className={navbarClass}>
            <Link className="logo-btn" to="/"><h2>Inven<span style={{ color: "green" }}>Tree</span></h2></Link>
            <div className="navbar-links">
                {/* Other Links can be added here */}
            </div>
            <div className="navbar-right">
                {/* Conditionally render search bar based on login status */}
                {isLoggedIn && (
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button type="submit">Search</button>
                    </form>
                )}
                {/* Conditionally render based on login status */}
                {isLoggedIn ? (
                    <button
                        className="user-profile"
                        onClick={onLogout}
                        style={{ cursor: "pointer" }}
                    >
                        <h2>Sign Out</h2>
                    </button>
                ) : (
                    <Link to="/" className="sign-in-btn">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
