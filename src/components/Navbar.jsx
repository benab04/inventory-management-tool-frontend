import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // Optional CSS for navbar styling
import { FaUser } from "react-icons/fa";
function Navbar({ isLoggedIn, onLogout }) {
    const location = useLocation(); // Get the current route

    // Conditional styling or class based on the current route
    const navbarClass = location.pathname === "/" ? "navbar navbar-transparent" : "navbar";
    return (
        <nav className={navbarClass}>
            <h2>Inven<span style={{ color: "green" }}>Tree</span></h2>
            <div className="navbar-links">
                {/* <Link to="/">Home</Link>
                <Link to="/tree-view">Inventory</Link> */}
            </div>
            <div className="navbar-right">
                {/* Conditionally render based on login status */}
                {isLoggedIn ? (
                    <div
                        className="user-profile"
                        onClick={onLogout}
                        style={{ cursor: "pointer" }}
                    ><div>Sign Out</div>

                    </div>
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
