import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ClinicCard from "../components/ClinicCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { clinics as demoClinics } from "../data/clinics";
import { cities } from "../data/cities";
import { getClinics } from "../api/api";

export default function Clinics() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(params.get("city") || "");
  const [apiClinics, setApiClinics] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getClinics()
      .then((data) => { if (!cancelled) setApiClinics(data); })
      .catch(() => { if (!cancelled) setApiClinics([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const allClinics = useMemo(() => [...apiClinics, ...demoClinics], [apiClinics]);

  const query = (params.get("q") || "").toLowerCase();

  const results = useMemo(() => allClinics.filter((c) => {
    if (city && c.city !== city) return false;
    if (query && !(c.name.toLowerCase().includes(query) || (c.specialty || "").toLowerCase().includes(query))) return false;
    return true;
  }), [allClinics, city, query]);

  return (
    <>
      <div className="page-intro">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Clinic Marketplace</span><h2>Clinics Near You</h2></div>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="sort-select">
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 0 }}>
        {loading ? <Loader count={8} /> : results.length === 0 ? (
          <EmptyState type="search" title="No clinics found" message="Try a different city or search term." />
        ) : (
          <div className="grid-cards grid-4">
            {results.map((c) => <ClinicCard key={c.id} clinic={c} />)}
          </div>
        )}
      </div>
    </>
  );
}
