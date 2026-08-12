import "./Unauthorized.css";

export default function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <h1 className="unauthorized-title">🚫 Access Denied</h1>
      <p className="unauthorized-text">You are not allowed to access this page.</p>
    </div>
  );
}