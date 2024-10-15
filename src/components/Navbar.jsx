import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Optional CSS for navbar styling

function Navbar({ isLoggedIn, onLogout }) {
    return (
        <nav className="navbar">
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
                    >
                        Sign Out
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
