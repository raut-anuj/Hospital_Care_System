import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Header.css";

export default function HospitalCareHeader() {
 const menuRef = useRef();
 const { logout: auth0Logout, isAuthenticated } = useAuth0();
 // theme state (true = dark)
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

 const toggleTheme = () => setDarkMode((s) => !s);

 return (
   <header className="header">
     <h1 className="header__title">Hospital Care</h1>

     <div className="header__actions">
       <button onClick={handleLogout} className="header__logout">
         Logout
       </button>

       <div className="header__menu-wrap" ref={menuRef}>
         {/* Theme toggle icon (click to toggle light/dark) */}
         <button
           onClick={toggleTheme}
           className="header__menu-btn header__theme-btn"
           aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
         >
           <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
         </button>
       </div>
     </div>
   </header>
 );
}
