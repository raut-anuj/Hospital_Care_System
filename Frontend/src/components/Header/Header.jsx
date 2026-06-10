import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function HospitalCareHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const { logout: auth0Logout, isAuthenticated } = useAuth0();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {   
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }     
  }, [darkMode]);

  // Logout handler   
const handleLogout = async () => {
  try {
    localStorage.clear();
    sessionStorage.clear();

    if (isAuthenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin + "/login",
        },
      });
      return;
    }

    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed", err);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }
};

  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300">
        Hospital Care
      </h1>

      <div className="flex items-center gap-4">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>

        {/* Theme Switcher */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Theme menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-20">
              <button
                onClick={() => setDarkMode(false)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                Light
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                Dark
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
