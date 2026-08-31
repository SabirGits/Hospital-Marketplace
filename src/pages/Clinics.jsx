import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ClinicCard from "../components/ClinicCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { clinics as allClinics } from "../data/clinics";
import { cities } from "../data/cities";

export default function Clinics() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(params.get("city") || "");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const query = (params.get("q") || "").toLowerCase();

  const results = useMemo(() => allClinics.filter((c) => {
    if (city && c.city !== city) return false;
    if (query && !(c.name.toLowerCase().includes(query) || c.specialty.toLowerCase().includes(query))) return false;
    return true;
  }), [city, query]);

  return (
    <div className="container section">
      <div className="section-head">
        <div><span className="eyebrow">Clinic Marketplace</span><h2>Clinics Near You</h2></div>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="sort-select">
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      {loading ? <Loader count={8} /> : results.length === 0 ? (
        <EmptyState type="search" title="No clinics found" message="Try a different city or search term." />
      ) : (
        <div className="grid-cards grid-4">
          {results.map((c) => <ClinicCard key={c.id} clinic={c} />)}
        </div>
      )}
    </div>
  );
}
