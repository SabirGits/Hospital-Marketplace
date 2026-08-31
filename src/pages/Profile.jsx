import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container section">
        <EmptyState type="search" title="You're not logged in" message="Log in to view your profile." actionLabel="Go to Login" onAction={() => (window.location.href = "/login")} />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="card" style={{ padding: 28, maxWidth: 480 }}>
        <span className="avatar-circle" style={{ width: 56, height: 56, fontSize: 22 }}>{user.name?.[0]?.toUpperCase()}</span>
        <h2 className="mt-16">{user.name}</h2>
        <p className="text-muted">{user.email}</p>
        <span className="badge badge-neutral mt-8" style={{ textTransform: "capitalize" }}>{user.role}</span>
        <Link to="/favorites" className="btn btn-outline btn-block mt-24">View Favorites</Link>
      </div>
    </div>
  );
}
