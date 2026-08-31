import { Star } from "lucide-react";

export default function Rating({ value, count, size = "sm" }) {
  return (
    <span className="rating" style={{ fontSize: size === "lg" ? "1rem" : undefined }}>
      <Star fill="currentColor" strokeWidth={0} />
      {value}
      {typeof count === "number" && <span className="count">({count})</span>}
    </span>
  );
}
