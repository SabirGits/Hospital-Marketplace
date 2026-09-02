import { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "../context/ToastContext";

/** Clickable 5-star input — separate from Rating.jsx, which is read-only display. */
export default function RatingInput({ onRate }) {
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleClick = async (value) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onRate(value);
      setSubmitted(true);
      showToast(`Thanks — you rated this ${value} star${value > 1 ? "s" : ""}.`);
    } catch (err) {
      showToast(err.message || "Couldn't submit your rating.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Thanks for rating!</p>;
  }

  return (
    <div className="rating-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="rating-input-star"
          disabled={submitting}
          onMouseEnter={() => setHover(n)}
          onClick={() => handleClick(n)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Star size={22} fill={n <= hover ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  );
}
