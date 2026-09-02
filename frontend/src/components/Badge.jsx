import { ShieldCheck, Siren, Clock, XCircle, Hourglass } from "lucide-react";

const VARIANTS = {
  verified: { cls: "badge-verified", icon: ShieldCheck, label: "Verified" },
  emergency: { cls: "badge-emergency", icon: Siren, label: "Emergency" },
  open: { cls: "badge-open", icon: Clock, label: "Open Now" },
  closed: { cls: "badge-closed", icon: XCircle, label: "Closed" },
  pending: { cls: "badge-pending", icon: Hourglass, label: "Pending" },
  neutral: { cls: "badge-neutral", icon: null, label: "" },
};

export default function Badge({ variant = "neutral", children }) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  const Icon = v.icon;
  return (
    <span className={`badge ${v.cls}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children || v.label}
    </span>
  );
}
