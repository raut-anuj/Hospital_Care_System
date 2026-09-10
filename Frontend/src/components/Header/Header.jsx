import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Sun, Moon } from "lucide-react";
import "../../styles/Header.css";

export default function HospitalCareHeader({ mode = "public" }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout: logoutFromAuth0 } = useAuth0();
  const isLoggedIn = mode === "authenticated";

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    if (isAuthenticated) {
      logoutFromAuth0({
        logoutParams: { returnTo: window.location.origin },
      });
      return;
    }

    navigate("/");
  };

  const showAuthButtons = mode === "public";

  return (
    <header className="header">
      {(mode === "public" || mode === "authenticated") && (
        <button
          type="button"
          className="header__title"
          onClick={() => navigate("/")}
          aria-label="Go to home page"
        >
          WellSpring Medical
        </button>
      )}

      <div className="header__actions">
        {mode === "theme-only" ? null : isLoggedIn ? (
          <button onClick={handleLogout} className="header__logout">
            Logout
          </button>
        ) : (
          showAuthButtons && (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="header__signup"
              >
                Sign Up
              </button>

              <button
                onClick={() => navigate("/login")}
                className="header__login"
              >
                Login
              </button>
            </>
          )
        )}

        <button
          onClick={toggleTheme}
          className="header__theme-btn"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun size={20} className="header__theme-icon--sun" />
          ) : (
            <Moon size={20} className="header__theme-icon--moon" />
          )}
        </button>
      </div>
    </header>
  );
}
