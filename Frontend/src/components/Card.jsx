import React from "react";

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-xl shadow-md bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}