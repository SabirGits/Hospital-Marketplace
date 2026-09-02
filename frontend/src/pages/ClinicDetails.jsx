import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Phone, Globe, MapPin, Navigation, Clock } from "lucide-react";
import { getClinicById as getDemoClinicById } from "../data/clinics";
import { getClinicById as fetchClinicById, rateClinic } from "../api/api";
import { getCityByName } from "../data/cities";
import ImageWithFallback from "../components/ImageWithFallback";
import Rating from "../components/Rating";
import RatingInput from "../components/RatingInput";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";

function buildMapQuery(clinic) {
  if (clinic.mapLink) return clinic.mapLink;
  if (clinic.address) return `${clinic.address}, ${clinic.city}, India`;
  const city = getCityByName(clinic.city);
  if (city) return `${city.lat},${city.lng}`;
  return clinic.city || clinic.name;
}

export default function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(() => getDemoClinicById(id) || null);
  const [loading, setLoading] = useState(!clinic);

  useEffect(() => {
    if (getDemoClinicById(id)) return;
    let cancelled = false;
    setLoading(true);
    fetchClinicById(id)
      .then((data) => { if (!cancelled) setClinic(data); })
      .catch(() => { if (!cancelled) setClinic(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="container section"><p className="text-muted">Loading clinic…</p></div>;
  }

  if (!clinic) {
    return <div className="container section"><EmptyState type="search" title="Clinic not found" message="This listing may have been removed." actionLabel="Browse Clinics" onAction={() => (window.location.href = "/clinics")} /></div>;
  }

  return (
    <div className="container section">
      <div className="doctor-profile-card">
        <ImageWithFallback src={clinic.image} alt={clinic.name} kind="clinic" />
        <div>
          <div className="flex-between">
            <h1>{clinic.name}</h1>
            {clinic.verified && <Badge variant="verified" />}
          </div>
          {clinic.specialty && <p className="text-muted">{clinic.specialty}</p>}
          <p className="text-muted"><MapPin size={14} /> {clinic.location}</p>
          <div className="flex gap-16 mt-8" style={{ alignItems: "center" }}>
            <Rating value={clinic.rating} count={clinic.reviews} size="lg" />
          </div>
          {clinic.hours && <p className="text-muted mt-8"><Clock size={14} /> {clinic.hours}</p>}
          {clinic.description && <p className="mt-16">{clinic.description}</p>}
          {clinic.services?.length > 0 && (
            <div className="hcard-tags mt-8">
              {clinic.services.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          )}
          <div className="flex gap-12 mt-24" style={{ flexWrap: "wrap", alignItems: "center" }}>
            <a href={`tel:${clinic.phone}`} className="btn btn-outline btn-sm"><Phone size={14} /> Call</a>
            {clinic.website && <a href={clinic.website} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Globe size={14} /> Website</a>}
          </div>
          <div className="mt-24">
            <p className="text-muted mb-8" style={{ fontSize: "var(--fs-sm)" }}>Rate this clinic</p>
            <RatingInput onRate={async (value) => {
              const updated = await rateClinic(clinic.id, value);
              setClinic((c) => ({ ...c, rating: updated.rating, reviews: updated.reviews }));
            }} />
          </div>
        </div>
      </div>

      <div className="card mt-24" style={{ padding: 24 }}>
        <h4 className="mb-16"><Navigation size={16} /> Location</h4>
        <iframe
          className="map-embed"
          title={`${clinic.name} location`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(buildMapQuery(clinic))}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
