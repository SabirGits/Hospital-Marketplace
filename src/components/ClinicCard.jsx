import { Phone, MapPin, Clock } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import Rating from "./Rating";
import Badge from "./Badge";

export default function ClinicCard({ clinic }) {
  return (
    <div className="card card-hover clinic-card">
      <ImageWithFallback src={clinic.image} alt={clinic.name} kind="clinic" className="ccard-media" />
      <div className="ccard-body">
        <div className="flex-between">
          <h4 className="hcard-title">{clinic.name}</h4>
          {clinic.verified && <Badge variant="verified" />}
        </div>
        <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}><MapPin size={13} /> {clinic.location}</p>
        <span className="tag">{clinic.specialty}</span>
        <Rating value={clinic.rating} count={clinic.reviews} />
        <p className="text-muted" style={{ fontSize: "var(--fs-xs)" }}><Clock size={12} /> {clinic.hours}</p>
        <div className="hcard-actions">
          <a href={`tel:${clinic.phone}`} className="btn btn-outline btn-sm"><Phone size={14} /> Call</a>
          <button className="btn btn-primary btn-sm">View Profile</button>
        </div>
      </div>
    </div>
  );
}
