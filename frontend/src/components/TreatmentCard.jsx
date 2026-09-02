import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function TreatmentCard({ treatment }) {
  return (
    <div className="card card-hover treatment-card">
      <span className="badge badge-neutral">{treatment.specialty}</span>
      <h4 className="mt-8">{treatment.name}</h4>
      <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>{treatment.desc}</p>
      <div className="flex-between mt-16">
        <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{treatment.hospitals} hospitals · {treatment.doctors} doctors</span>
      </div>
      <Link to={`/hospitals?specialty=${encodeURIComponent(treatment.specialty)}`} className="btn btn-outline btn-sm btn-block mt-16">
        Explore Providers <ArrowRight size={14} />
      </Link>
    </div>
  );
}
