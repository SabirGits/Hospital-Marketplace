import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, X, Scale } from "lucide-react";
import SearchBar from "../components/SearchBar";
import HospitalCard from "../components/HospitalCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { hospitals as demoHospitals } from "../data/hospitals";
import { cities } from "../data/cities";
import { specialties } from "../data/specialties";
import { useCompare } from "../context/CompareContext";
import { getHospitals } from "../api/api";

const HOSPITAL_TYPES = ["General", "Multi-Specialty", "Super-Specialty", "Specialty"];
const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
];

export default function Hospitals() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: params.get("city") || "",
    type: "",
    specialty: params.get("specialty") || "",
    emergency: false,
    openNow: false,
    minRating: 0,
  });
  const [sort, setSort] = useState("recommended");
  const [apiHospitals, setApiHospitals] = useState([]);
  const compare = useCompare();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getHospitals()
      .then((data) => { if (!cancelled) setApiHospitals(data); })
      .catch(() => { if (!cancelled) setApiHospitals([]); }) // backend not running yet — demo data still shows
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Real, registered hospitals appear alongside the demo catalogue so the
  // marketplace never looks empty while the backend is still growing.
  const allHospitals = useMemo(() => [...apiHospitals, ...demoHospitals], [apiHospitals]);

  const query = (params.get("q") || "").toLowerCase();

  const results = useMemo(() => {
    let list = allHospitals.filter((h) => {
      if (filters.city && h.city !== filters.city) return false;
      if (filters.type && h.type !== filters.type) return false;
      if (filters.specialty && !h.specialties.includes(filters.specialty)) return false;
      if (filters.emergency && !h.emergency) return false;
      if (filters.openNow && !h.isOpen) return false;
      if (filters.minRating && h.rating < filters.minRating) return false;
      if (query && !(h.name.toLowerCase().includes(query) || h.specialties.join(" ").toLowerCase().includes(query) || h.city.toLowerCase().includes(query))) return false;
      return true;
    });
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === "newest") list = [...list].sort((a, b) => b.est - a.est);
    return list;
  }, [allHospitals, filters, sort, query]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => setFilters({ city: "", type: "", specialty: "", emergency: false, openNow: false, minRating: 0 });

  return (
    <div className="listing-page">
      <div className="listing-search-bar">
        <div className="container">
          <SearchBar variant="compact" />
        </div>
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
            <label>City</label>
            <select value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}>
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Hospital Type</label>
            <select value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
              <option value="">Any Type</option>
              {HOSPITAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Specialty</label>
            <select value={filters.specialty} onChange={(e) => updateFilter("specialty", e.target.value)}>
              <option value="">Any Specialty</option>
              {specialties.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <select value={filters.minRating} onChange={(e) => updateFilter("minRating", Number(e.target.value))}>
              <option value={0}>Any Rating</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>
          </div>

          <div className="filter-group filter-checks">
            <label className="check-row">
              <input type="checkbox" checked={filters.emergency} onChange={(e) => updateFilter("emergency", e.target.checked)} /> Emergency Available
            </label>
            <label className="check-row">
              <input type="checkbox" checked={filters.openNow} onChange={(e) => updateFilter("openNow", e.target.checked)} /> Open Now
            </label>
          </div>

          <button className="btn btn-ghost btn-block" onClick={clearFilters}>Clear Filters</button>
          <button className="btn btn-primary btn-block mobile-only mt-16" onClick={() => setDrawerOpen(false)}>Show {results.length} Results</button>
        </aside>

        {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}

        <div className="listing-results">
          <div className="flex-between mb-16 listing-toolbar">
            <p className="text-muted">{loading ? "Searching…" : `${results.length} hospitals found`}</p>
            <div className="flex gap-8" style={{ alignItems: "center" }}>
              {compare.compareIds.length > 0 && (
                <Link to="/compare" className="btn btn-accent btn-sm"><Scale size={14} /> Compare ({compare.compareIds.length})</Link>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader count={6} />
          ) : results.length === 0 ? (
            <EmptyState type="search" title="No hospitals found" message="Try adjusting your filters or search a different city." actionLabel="Clear Filters" onAction={clearFilters} />
          ) : (
            <div className="grid-cards grid-3">
              {results.map((h) => <HospitalCard key={h.id} hospital={h} showCompare />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
