import React from "react";
import './Card.css';

export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}