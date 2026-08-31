import { Link } from "react-router-dom";
import { Heart, Brain, Bone, Baby, Sparkles, Flower2, Ribbon, Stethoscope, Smile, Ear, ArrowRight } from "lucide-react";

const ICONS = { heart: Heart, brain: Brain, bone: Bone, baby: Baby, skin: Sparkles, gyno: Flower2, ribbon: Ribbon, stethoscope: Stethoscope, tooth: Smile, ear: Ear };

export default function SpecialtyCard({ specialty }) {
  const Icon = ICONS[specialty.icon] || Stethoscope;
  return (
    <Link to={`/treatments?specialty=${encodeURIComponent(specialty.name)}`} className="card card-hover specialty-card">
      <div className="service-icon"><Icon size={22} /></div>
      <h4>{specialty.name}</h4>
      <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>{specialty.desc}</p>
      <div className="flex-between mt-16">
        <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{specialty.providers} providers</span>
        <span className="explore-link">Explore <ArrowRight size={14} /></span>
      </div>
    </Link>
  );
}
