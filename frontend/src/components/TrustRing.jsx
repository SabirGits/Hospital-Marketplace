import { Check } from "lucide-react";

/** Signature brand element: a stamped "seal of trust" ring showing a provider's trust score. */
export default function TrustRing({ score = 90, size = 40 }) {
  return (
    <div className="trust-ring" style={{ "--pct": score, "--ring-size": `${size}px` }} title={`Trust score ${score}`}>
      <Check strokeWidth={3} />
    </div>
  );
}
