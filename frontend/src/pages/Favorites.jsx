import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import EmptyState from "../components/EmptyState";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container section">
        <EmptyState type="favorites" title="No favorites yet" message="Save hospitals and doctors you like to find them here." actionLabel="Browse Hospitals" onAction={() => (window.location.href = "/hospitals")} />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head"><div><span className="eyebrow">Saved</span><h2>Your Favorites</h2></div></div>
      <div className="grid-cards grid-3">
        {favorites.map((f) => (
          <div className="card" style={{ padding: 18 }} key={`${f.type}-${f.id}`}>
            <div className="flex-between">
              <div>
                <span className="tag">{f.type}</span>
                <h4 className="mt-8">{f.name}</h4>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => toggleFavorite(f)} aria-label="Remove"><Heart size={16} fill="currentColor" /></button>
            </div>
            <Link to={f.type === "hospital" ? `/hospitals/${f.id}` : `/doctors/${f.id}`} className="btn btn-outline btn-sm btn-block mt-16">View Profile</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
