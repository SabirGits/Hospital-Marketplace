import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Globe, Scale } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import Rating from "./Rating";
import Badge from "./Badge";
import TrustRing from "./TrustRing";
import { useFavorites } from "../context/FavoritesContext";
import { useCompare } from "../context/CompareContext";

export default function HospitalCard({ hospital, showCompare = false }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const compareCtx = useCompare();
  const favored = isFavorite(hospital.id, "hospital");
  const inCompare = compareCtx?.compareIds.includes(hospital.id);

  return (
    <div className="card card-hover hospital-card">
      <div className="hcard-media">
        <ImageWithFallback src={hospital.image} alt={`${hospital.name} building`} kind="hospital" />
        <button
          className={`fav-btn ${favored ? "is-fav" : ""}`}
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite({ id: hospital.id, type: "hospital", name: hospital.name })}
        >
          <Heart size={16} fill={favored ? "currentColor" : "none"} />
        </button>
        <div className="hcard-badges">
          {hospital.emergency && <Badge variant="emergency">Emergency</Badge>}
          <Badge variant={hospital.isOpen ? "open" : "closed"}>{hospital.isOpen ? "Open Now" : "Closed"}</Badge>
        </div>
      </div>

      <div className="hcard-body">
        <div className="flex-between">
          <Link to={`/hospitals/${hospital.id}`} className="hcard-title">{hospital.name}</Link>
          {hospital.verified && <TrustRing score={hospital.trustScore} size={36} />}
        </div>

        <div className="hcard-meta">
          <span><MapPin size={13} /> {hospital.city}</span>
          <span className="dot">•</span>
          <span>{hospital.type}</span>
        </div>

        <Rating value={hospital.rating} count={hospital.reviews} />

        <div className="hcard-tags">
          {hospital.specialties.slice(0, 3).map((s) => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>

        <div className="hcard-actions">
          <a href={`tel:${hospital.phone}`} className="btn btn-outline btn-sm"><Phone size={14} /> Call</a>
          <a href={hospital.website} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Globe size={14} /> Website</a>
          <Link to={`/hospitals/${hospital.id}`} className="btn btn-primary btn-sm">View Profile</Link>
        </div>

        {showCompare && compareCtx && (
          <label className="compare-check">
            <input
              type="checkbox"
              checked={inCompare}
              onChange={() => compareCtx.toggleCompare(hospital.id)}
              disabled={!inCompare && compareCtx.compareIds.length >= compareCtx.maxCompare}
            />
            <Scale size={13} /> Add to compare
          </label>
        )}
      </div>
    </div>
  );
}
