import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import DoctorCard from "../components/DoctorCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { doctors as demoDoctors } from "../data/doctors";
import { cities } from "../data/cities";
import { specialties } from "../data/specialties";
import { getDoctors } from "../api/api";

export default function Doctors() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [apiDoctors, setApiDoctors] = useState([]);
  const [filters, setFilters] = useState({
    city: params.get("city") || "",
    specialty: params.get("specialty") || "",
    minExperience: 0,
    availableOnly: false,
  });

  useEffect(() => {
    let cancelled = false;
    getDoctors()
      .then((data) => { if (!cancelled) setApiDoctors(data); })
      .catch(() => { if (!cancelled) setApiDoctors([]); }) // backend not running yet — demo data still shows
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Doctors added by real hospitals show up alongside the demo catalogue.
  const allDoctors = useMemo(() => [...apiDoctors, ...demoDoctors], [apiDoctors]);

  const query = (params.get("q") || "").toLowerCase();

  const results = useMemo(() => {
    return allDoctors.filter((d) => {
      if (filters.city && d.city !== filters.city) return false;
      if (filters.specialty && d.specialty !== filters.specialty) return false;
      if (filters.minExperience && d.experience < filters.minExperience) return false;
      if (filters.availableOnly && !d.available) return false;
      if (query && !(d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query))) return false;
      return true;
    });
  }, [allDoctors, filters, query]);

  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clear = () => setFilters({ city: "", specialty: "", minExperience: 0, availableOnly: false });

  return (
    <div className="listing-page">
      <div className="container section-head pt-32">
        <div><span className="eyebrow">Doctor Marketplace</span><h2>Find the Right Doctor</h2></div>
      </div>

      <div className="container listing-layout">
        <button className="btn btn-outline mobile-only filter-toggle" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>

        <aside className={`filter-sidebar ${drawerOpen ? "open" : ""}`}>
          <div className="filter-sidebar-head">
            <h3>Filters</h3>
            <button className="btn-icon btn-ghost mobile-only" onClick={() => setDrawerOpen(false)}><X size={18} /></button>
          </div>
          <div className="filter-group">
            <label>Specialty</label>
            <select value={filters.specialty} onChange={(e) => update("specialty", e.target.value)}>
              <option value="">Any Specialty</option>
              {specialties.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>City</label>
            <select value={filters.city} onChange={(e) => update("city", e.target.value)}>
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Minimum Experience</label>
            <select value={filters.minExperience} onChange={(e) => update("minExperience", Number(e.target.value))}>
              <option value={0}>Any Experience</option>
              <option value={5}>5+ years</option>
              <option value={10}>10+ years</option>
              <option value={15}>15+ years</option>
            </select>
          </div>
          <div className="filter-group filter-checks">
            <label className="check-row">
              <input type="checkbox" checked={filters.availableOnly} onChange={(e) => update("availableOnly", e.target.checked)} /> Available Only
            </label>
          </div>
          <button className="btn btn-ghost btn-block" onClick={clear}>Clear Filters</button>
          <button className="btn btn-primary btn-block mobile-only mt-16" onClick={() => setDrawerOpen(false)}>Show {results.length} Results</button>
        </aside>

        {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}

        <div className="listing-results">
          <p className="text-muted mb-16">{loading ? "Searching…" : `${results.length} doctors found`}</p>
          {loading ? <Loader count={8} /> : results.length === 0 ? (
            <EmptyState type="search" title="No doctors found" message="Try adjusting your filters." actionLabel="Clear Filters" onAction={clear} />
          ) : (
            <div className="grid-cards grid-3">
              {results.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
