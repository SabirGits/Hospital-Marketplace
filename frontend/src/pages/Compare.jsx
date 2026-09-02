import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { hospitals } from "../data/hospitals";
import { useCompare } from "../context/CompareContext";
import EmptyState from "../components/EmptyState";
import Rating from "../components/Rating";
import Badge from "../components/Badge";
import ImageWithFallback from "../components/ImageWithFallback";

const ROWS = [
  { key: "rating", label: "Rating", render: (h) => <Rating value={h.rating} count={h.reviews} /> },
  { key: "city", label: "Location", render: (h) => `${h.city}` },
  { key: "beds", label: "Beds", render: (h) => h.beds },
  { key: "emergency", label: "Emergency", render: (h) => (h.emergency ? <Badge variant="emergency" /> : "Not available") },
  { key: "departments", label: "Departments", render: (h) => h.departments.join(", ") },
  { key: "facilities", label: "Facilities", render: (h) => h.facilities.join(", ") },
  { key: "doctors", label: "Est. Doctors On Staff", render: (h) => Math.round(h.beds / 4) },
  { key: "website", label: "Website", render: (h) => <a href={h.website} target="_blank" rel="noreferrer">{h.website.replace("https://", "")}</a> },
  { key: "phone", label: "Contact", render: (h) => h.phone },
];

export default function Compare() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const selected = hospitals.filter((h) => compareIds.includes(h.id));

  if (selected.length === 0) {
    return (
      <div className="container section">
        <EmptyState type="search" title="No hospitals to compare" message="Select up to 3 hospitals from the listing page to compare them here." actionLabel="Browse Hospitals" onAction={() => (window.location.href = "/hospitals")} />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-head">
        <div><span className="eyebrow">Marketplace Feature</span><h2>Compare Hospitals</h2></div>
        <button className="btn btn-outline btn-sm" onClick={clearCompare}>Clear All</button>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Attribute</th>
              {selected.map((h) => (
                <th key={h.id}>
                  <div className="compare-col-head">
                    <button className="btn-icon btn-ghost btn-sm" onClick={() => toggleCompare(h.id)} aria-label="Remove"><X size={14} /></button>
                    <ImageWithFallback src={h.image} alt={h.name} kind="hospital" />
                    <Link to={`/hospitals/${h.id}`}>{h.name}</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <td className="compare-row-label">{row.label}</td>
                {selected.map((h) => <td key={h.id}>{row.render(h)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
