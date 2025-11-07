import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import api from "./utils/api";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.setToken(token);
      api
        .get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          api.setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    api.setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 font-semibold text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="min-h-[calc(100vh-180px)]">
        {/* Keeps footer from jumping up on short pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feed" element={<Feed user={user} />} />

          <Route
            path="/login"
            element={
              !user ? <Login onLogin={setUser} /> : <Navigate to="/feed" />
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register onRegister={setUser} />
              ) : (
                <Navigate to="/feed" />
              )
            }
          />
          <Route
            path="/profile/:id"
            element={<Profile currentUser={user} onProfileUpdate={setUser} />}
          />
        </Routes>
        <Toaster
        position="top-center"
        toastOptions={{ duration: 3000 }} // Auto-hide in 3s
      />
      </main>
      <Footer />
    </Router>
  );
}
