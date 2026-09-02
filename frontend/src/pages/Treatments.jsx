import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TreatmentCard from "../components/TreatmentCard";
import EmptyState from "../components/EmptyState";
import { treatments } from "../data/treatments";

export default function Treatments() {
  const [params] = useSearchParams();
  const [specialty, setSpecialty] = useState(params.get("specialty") || "");
  const specialtyOptions = [...new Set(treatments.map((t) => t.specialty))];

  const results = useMemo(() => treatments.filter((t) => !specialty || t.specialty === specialty), [specialty]);

  return (
    <>
      <div className="page-intro">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Care Pathways</span><h2>Treatments</h2></div>
            <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="sort-select">
              <option value="">All Specialties</option>
              {specialtyOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 0 }}>
        {results.length === 0 ? (
          <EmptyState type="search" title="No treatments found" message="Try a different specialty." />
        ) : (
          <div className="grid-cards grid-3">
            {results.map((t) => <TreatmentCard key={t.id} treatment={t} />)}
          </div>
        )}
      </div>
    </>
  );
}
