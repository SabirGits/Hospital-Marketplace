import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { cities } from "../data/cities";
import { specialties } from "../data/specialties";

const SEARCH_TYPES = [
  { value: "hospital", label: "Hospital", path: "/hospitals" },
  { value: "doctor", label: "Doctor", path: "/doctors" },
  { value: "clinic", label: "Clinic", path: "/clinics" },
  { value: "treatment", label: "Treatment", path: "/treatments" },
  { value: "specialty", label: "Specialty", path: "/treatments" },
];

const suggestionPool = [
  "Cardiology", "Neurology", "Orthopedics", "Emergency", "Dentistry", "Cancer Care", "Pediatrics",
];

export default function SearchBar({ variant = "hero" }) {
  const navigate = useNavigate();
  const [type, setType] = useState("hospital");
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggest(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return [
      ...specialties.filter((s) => s.name.toLowerCase().includes(q)).map((s) => s.name),
      ...suggestionPool.filter((s) => s.toLowerCase().includes(q)),
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 6);
  }, [query]);

  const runSearch = (overrideQuery) => {
    const cfg = SEARCH_TYPES.find((t) => t.value === type) || SEARCH_TYPES[0];
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    const q = overrideQuery ?? query;
    if (q) params.set("q", q);
    setShowSuggest(false);
    navigate(`${cfg.path}?${params.toString()}`);
  };

  return (
    <div className={`search-bar search-bar-${variant}`} ref={boxRef}>
      <div className="search-field">
        <label>Search for</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {SEARCH_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="search-field search-field-query">
        <label>Keyword</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="e.g. cardio, dental, checkup"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
            onFocus={() => setShowSuggest(true)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          {showSuggest && matches.length > 0 && (
            <ul className="search-suggest">
              {matches.map((m) => (
                <li key={m} onClick={() => { setQuery(m); runSearch(m); }}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="search-field">
        <label><MapPin size={12} /> Location</label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary search-btn" onClick={() => runSearch()}>
        <Search size={16} /> Search
      </button>
    </div>
  );
}
