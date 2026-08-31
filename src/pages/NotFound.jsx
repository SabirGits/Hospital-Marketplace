import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: "center", padding: "100px 24px" }}>
      <CompassIcon size={46} style={{ color: "var(--gray-300)", margin: "0 auto 16px" }} />
      <h1>404 — Page Not Found</h1>
      <p className="text-muted mt-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary mt-24">Back to Home</Link>
    </div>
  );
}
