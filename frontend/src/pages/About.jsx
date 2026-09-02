import { ShieldCheck, Users, MapPinned, Target } from "lucide-react";

const VALUES = [
  { icon: ShieldCheck, title: "Trust First", desc: "Every hospital, clinic and doctor is verified before it appears on the marketplace." },
  { icon: Users, title: "Patient Focused", desc: "We design around what patients need to make confident healthcare decisions." },
  { icon: MapPinned, title: "Nationwide Reach", desc: "Coverage across 50+ Indian cities, from metros to growing towns." },
  { icon: Target, title: "Clarity Over Clutter", desc: "Transparent ratings and comparisons — no noise, no guesswork." },
];

export default function About() {
  return (
    <div className="container section">
      <span className="eyebrow">About Us</span>
      <h1>Healthcare discovery, built on trust</h1>
      <p className="hero-sub mt-16" style={{ maxWidth: 680 }}>
        Hospital Marketplace connects patients with verified hospitals, clinics, doctors and treatment
        providers across India. Our goal is simple: make choosing healthcare as clear and confident
        as choosing anything else online.
      </p>
      <div className="grid-cards grid-4 mt-32">
        {VALUES.map((v) => (
          <div className="card" style={{ padding: 22 }} key={v.title}>
            <div className="service-icon"><v.icon size={20} /></div>
            <h4 className="mt-8">{v.title}</h4>
            <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
