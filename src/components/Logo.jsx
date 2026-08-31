/** Custom brand mark — a shield (trust) with an integrated pulse line and a plus (care). */
export default function Logo({ size = 36, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="hm-logo-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1668B0" />
          <stop offset="1" stopColor="#0F8B6C" />
        </linearGradient>
      </defs>
      <path
        d="M22 3 L38 9 V21 C38 31.5 31.5 38.5 22 41 C12.5 38.5 6 31.5 6 21 V9 L22 3 Z"
        fill="url(#hm-logo-grad)"
      />
      <path
        d="M13 22.5 H17.5 L19.7 17 L23.3 28 L25.7 22.5 H31"
        stroke={light ? "#ffffff" : "#ffffff"}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
