import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { ToastContainer, toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import default CSS
import "./Login.css";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = Cookies.get("isLoggedIn"); // Retrieve the cookie
        if (loggedIn) {
            // Show toast notification if already logged in
            toast.info("You are already logged in!", {
                position: "top-right",
                autoClose: 3000, // Close after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            // Redirect after a short delay
            setTimeout(() => {
                navigate("/warehouses");
            }, 3000); // 3 seconds delay
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "password123") {
            // Set the login cookie with a 30-minute expiration
            Cookies.set("isLoggedIn", "true", { expires: 1 / 48 });

            onLogin(true); // Update App state to logged in
            navigate("/warehouses"); // Redirect to /warehouses
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-page">
            <ToastContainer /> {/* Required for toast notifications */}
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
