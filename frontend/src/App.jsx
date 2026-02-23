import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import SendMail from "./components/SendMail";
import History from "./components/History";
import AdminLogin from "./pages/AdminLogin";

function App() {

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check login status on refresh
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  return (
    <div>

      {/* Show Navbar only if Admin logged in */}
      {isAdminLoggedIn && (
        <Navbar setIsAdminLoggedIn={setIsAdminLoggedIn} />
      )}

      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAdminLoggedIn
              ? <Navigate to="/dashboard" />
              : <Navigate to="/admin/login" />
          }
        />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            isAdminLoggedIn
              ? <Navigate to="/dashboard" />
              : <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAdminLoggedIn
              ? <SendMail />
              : <Navigate to="/admin/login" />
          }
        />

        {/* Admin History */}
        <Route
          path="/history"
          element={
            isAdminLoggedIn
              ? <History />
              : <Navigate to="/admin/login" />
          }
        />

      </Routes>
    </div>
  );
}

export default App;