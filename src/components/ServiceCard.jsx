import { HeartPulse, Stethoscope, Truck, Pill, Scissors, ClipboardCheck, Activity, FlaskConical, Droplet, ScanLine, Bed, Home, ArrowRight } from "lucide-react";

const ICONS = {
  "emergency-care": HeartPulse, "diagnostics": Stethoscope, "ambulance": Truck, "pharmacy": Pill,
  "surgery": Scissors, "health-checkups": ClipboardCheck, "physiotherapy": Activity, "laboratory": FlaskConical,
  "blood-bank": Droplet, "imaging": ScanLine, "icu": Bed, "home-care": Home,
};

export default function ServiceCard({ service }) {
  const Icon = ICONS[service.id] || Stethoscope;
  return (
    <div className="card card-hover service-card">
      <div className="service-icon"><Icon size={22} /></div>
      <h4>{service.name}</h4>
      <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>{service.desc}</p>
      <div className="flex-between mt-16">
        <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{service.providers} providers</span>
        <span className="explore-link">Explore <ArrowRight size={14} /></span>
      </div>
    </div>
  );
}
