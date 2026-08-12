import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";

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
   <header className="header">
     <h1 className="header__title">Hospital Care</h1>

     <div className="header__actions">
       <button onClick={handleLogout} className="header__logout">
         Logout
       </button>

       <div className="header__menu-wrap" ref={menuRef}>
         <button
           onClick={() => setOpen(!open)}
           className="header__menu-btn"
           aria-label="Theme menu"
         >
           <svg
             className="header__icon"
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
           <div className="header__dropdown">
             <button
               onClick={() => setDarkMode(false)}
               className="header__dropdown-btn"
             >
               Light
             </button>
             <button
               onClick={() => setDarkMode(true)}
               className="header__dropdown-btn"
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
