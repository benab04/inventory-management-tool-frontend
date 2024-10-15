import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TreeView from "./components/TreeView";
import ItemDetails from "./components/ItemDetails";
import Login from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Cookies from "js-cookie"; // Import js-cookie

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default isLoggedIn state as false

  useEffect(() => {
    const loggedInCookie = Cookies.get("isLoggedIn"); // Check for the login cookie
    if (loggedInCookie) {
      setIsLoggedIn(true); // Set the logged-in state if the cookie exists
    }
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status); // Update login state
    if (status) {
      Cookies.set("isLoggedIn", "true", { expires: 1 / 48 }); // Set cookie for 30 minutes
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("isLoggedIn");

    // Logout sets the isLoggedIn state back to false
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <DndProvider backend={HTML5Backend}>
        <div className="app-container">
          <Routes>

            {/* Login Route */}
            <Route path="/" element={<Login onLogin={handleLogin} />} />

            {/* Protected Tree View Route */}
            <Route
              path="/warehouses"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <div className="content-container">
                    <div className="sidebar">
                      <TreeView onItemSelected={setSelectedItem} />
                    </div>
                    <div className="main-content">
                      <ItemDetails item={selectedItem} />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </DndProvider>
    </Router>
  );
}

export default App;
