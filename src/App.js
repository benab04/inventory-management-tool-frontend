import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TreeView from "./components/TreeView";
import ItemDetails from "./components/ItemDetails";
import Login from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SearchResults from "./components/SearchResults"; // Import SearchResults component
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Cookies from "js-cookie";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [categoryFilter, setCategoryFilter] = useState("all"); // State for category filter
  const [page, setPage] = useState(1); // State for pagination

  useEffect(() => {
    const loggedInCookie = Cookies.get("isLoggedIn");
    if (loggedInCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    if (status) {
      Cookies.set("isLoggedIn", "true", { expires: 1 / 48 });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("isLoggedIn");
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        setSearchQuery={setSearchQuery} // Pass setSearchQuery
        setCategoryFilter={setCategoryFilter} // Pass setCategoryFilter
      />
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
                      {/* Include the SearchResults component */}
                      <SearchResults
                        query={searchQuery}
                        category={categoryFilter}
                        page={page}
                        setPage={setPage}
                      />
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
