import { useState } from "react";

const GRADIENTS = {
  hospital: ["#1668B0", "#0F8B6C"],
  doctor: ["#0d2b4e", "#1668B0"],
  clinic: ["#0F8B6C", "#14a37f"],
  city: ["#0a1f38", "#1668B0"],
  general: ["#1668B0", "#0d2b4e"],
};

const ICON_PATHS = {
  hospital: "M12 2 L12 22 M4 9 H10 M14 9 H20 M6 9 V22 M18 9 V22",
  doctor: "M12 4 a4 4 0 1 0 0.001 0 M6 21 c0 -4 2.5 -6 6 -6 s6 2 6 6",
  clinic: "M4 21 H20 M6 21 V9 L12 4 L18 9 V21 M10 21 V15 H14 V21",
  city: "M4 21 H20 M6 21 V6 H11 V21 M13 21 V11 H18 V21",
  general: "M4 21 H20 M6 21 V9 L12 4 L18 9 V21",
};

function placeholderSrc(kind = "general") {
  const [c1, c2] = GRADIENTS[kind] || GRADIENTS.general;
  const path = ICON_PATHS[kind] || ICON_PATHS.general;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <g transform="translate(176,124) scale(2)" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9">
      <path d="${path}"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Drop-in <img> replacement that swaps to a themed inline SVG placeholder
 * if the real image fails to load — keeps every card a consistent size
 * instead of collapsing to a broken-image icon.
 */
export default function ImageWithFallback({ src, alt, kind = "general", className, style }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed || !src ? placeholderSrc(kind) : src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
