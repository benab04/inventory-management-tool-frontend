import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import "./Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Check for login cookie on component mount
    useEffect(() => {
        const loggedIn = Cookies.get("isLoggedIn"); // Retrieve the cookie
        if (loggedIn) {
            navigate("/warehouses"); // Redirect if cookie exists
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "password123") {
            // Set the login cookie with a 30-minute expiration
            Cookies.set("isLoggedIn", "true", { expires: 1 / 48 }); // 30 minutes = 1/48 days

            onLogin(true); // Update App state to logged in
            navigate("/warehouses"); // Redirect to /warehouses
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h2 style={{ color: "#001524" }}>Sign In</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="submit-btn" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
