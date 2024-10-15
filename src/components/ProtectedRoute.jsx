// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie

function ProtectedRoute({ children }) {
    // Check if the login cookie exists
    const isLoggedIn = Cookies.get("isLoggedIn");

    return isLoggedIn ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
