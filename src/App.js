import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TreeView from "./components/TreeView";
import ItemDetails from "./components/ItemDetails";
import Login from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default isLoggedIn state as false

  const handleLogin = (status) => {
    setIsLoggedIn(status); // This updates the isLoggedIn state
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Logout sets the isLoggedIn state back to false
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
