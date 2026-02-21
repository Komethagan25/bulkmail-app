import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SendMail from "./components/SendMail";
import History from "./components/History";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>

      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}


      <Routes>

        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} />

        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/dashboard" element={isLoggedIn ? <SendMail /> : <Navigate to="/login" />} />

        <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />

      </Routes>
    </div>
  );
}

export default App;
