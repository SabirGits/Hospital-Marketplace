import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, Globe, MapPin, Share2, Navigation, Heart, BedDouble, Users, Building, Award } from "lucide-react";
import { getHospitalById as getDemoHospitalById } from "../data/hospitals";
import { getHospitalById as fetchHospitalById } from "../api/api";
import { getCityByName } from "../data/cities";
import { doctors } from "../data/doctors";
import { treatments } from "../data/treatments";
import Rating from "../components/Rating";
import Badge from "../components/Badge";
import TrustRing from "../components/TrustRing";
import ImageWithFallback from "../components/ImageWithFallback";
import DoctorCard from "../components/DoctorCard";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";

const TABS = ["Overview", "Departments", "Doctors", "Treatments", "Services", "Facilities", "Reviews", "Location"];

// Prefers the exact link the hospital pasted, then a full text address, and
// only falls back to the city's real center coordinates if neither exists —
// so the embed always shows an actual place on the map, never a blank one.
function buildMapQuery(hospital) {
  if (hospital.mapLink) return hospital.mapLink;
  if (hospital.address) return `${hospital.address}, ${hospital.city}, India`;
  const city = getCityByName(hospital.city);
  if (city) return `${city.lat},${city.lng}`;
  return hospital.city || hospital.name;
}

const REVIEWS = [
  { name: "Anita R.", rating: 5, text: "Excellent care and very responsive staff during a family emergency." },
  { name: "Vikas S.", rating: 4, text: "Clean facility, doctors explained everything clearly." },
  { name: "Farah K.", rating: 5, text: "The emergency team was fast and professional." },
];

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(() => getDemoHospitalById(id) || null);
  const [loading, setLoading] = useState(!hospital);
  const [tab, setTab] = useState("Overview");
  const [contactOpen, setContactOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();

  useEffect(() => {
    // Demo IDs (e.g. "hosp-1") resolve instantly from local data above.
    // Anything else is a real backend _id — fetch it from the API.
    if (getDemoHospitalById(id)) return;
    let cancelled = false;
    setLoading(true);
    fetchHospitalById(id)
      .then((data) => { if (!cancelled) setHospital(data); })
      .catch(() => { if (!cancelled) setHospital(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="container section"><p className="text-muted">Loading hospital…</p></div>;
  }

  if (!hospital) {
    return <div className="container section"><EmptyState type="search" title="Hospital not found" message="This listing may have been removed." actionLabel="Browse Hospitals" onAction={() => (window.location.href = "/hospitals")} /></div>;
  }

  const relatedDoctors = doctors.filter((d) => d.hospitalId === hospital.id).slice(0, 3);
  const relatedTreatments = treatments.filter((t) => hospital.specialties.includes(t.specialty)).slice(0, 4);
  const favored = isFavorite(hospital.id, "hospital");

  return (
    <div className="hospital-profile">
      <div className="profile-header">
        <ImageWithFallback src={hospital.image} alt={hospital.name} kind="hospital" className="profile-cover" />
        <div className="container profile-header-content">
          <div className="profile-header-main">
            <div className="flex-between">
              <h1>{hospital.name}</h1>
              {hospital.verified && <TrustRing score={hospital.trustScore} size={48} />}
            </div>
            <div className="profile-meta-row">
              <Rating value={hospital.rating} count={hospital.reviews} size="lg" />
              <span><MapPin size={14} /> {hospital.address}</span>
              <Badge variant={hospital.isOpen ? "open" : "closed"}>{hospital.isOpen ? "Open Now" : "Closed"}</Badge>
              {hospital.emergency && <Badge variant="emergency" />}
            </div>
          </div>
          <div className="profile-header-actions">
            <a href={`tel:${hospital.phone}`} className="btn btn-outline btn-sm"><Phone size={14} /> Call</a>
            <a href={hospital.website} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Globe size={14} /> Website</a>
            <button className="btn btn-outline btn-sm" onClick={() => setContactOpen(true)}><Navigation size={14} /> Directions</button>
            <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("Link copied to clipboard"); }}><Share2 size={14} /> Share</button>
            <button className={`btn btn-sm ${favored ? "btn-accent" : "btn-primary"}`} onClick={() => toggleFavorite({ id: hospital.id, type: "hospital", name: hospital.name })}>
              <Heart size={14} fill={favored ? "currentColor" : "none"} /> {favored ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="container profile-tabs-bar">
        {TABS.map((t) => (
          <button key={t} className={`profile-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="container profile-body">
        {tab === "Overview" && (
          <div className="profile-grid">
            <div>
              <h3>About {hospital.name}</h3>
              <p className="text-muted mt-8">{hospital.description}</p>
              <div className="info-grid mt-24">
                <div className="info-item"><Award size={16} /><span>Established</span><strong>{hospital.est}</strong></div>
                <div className="info-item"><BedDouble size={16} /><span>Beds</span><strong>{hospital.beds}</strong></div>
                <div className="info-item"><Users size={16} /><span>Doctors</span><strong>{Math.round(hospital.beds / 4)}+</strong></div>
                <div className="info-item"><Building size={16} /><span>Departments</span><strong>{hospital.departments.length}</strong></div>
                <div className="info-item"><Badge variant="emergency">{hospital.emergency ? "Available" : "N/A"}</Badge><span>Emergency</span></div>
                <div className="info-item"><Award size={16} /><span>Accreditation</span><strong>{hospital.accreditation}</strong></div>
              </div>
            </div>
            <div className="profile-side-card">
              <h4>Contact</h4>
              <p><Phone size={14} /> {hospital.phone}</p>
              <p>{hospital.email}</p>
              <p><MapPin size={14} /> {hospital.address}</p>
              <hr />
              <h4>Emergency Contact</h4>
              <p><Phone size={14} /> {hospital.phone} (24x7)</p>
            </div>
          </div>
        )}

        {tab === "Departments" && (
          <div className="grid-cards grid-3">
            {hospital.departments.map((d) => (
              <div className="card" style={{ padding: 20 }} key={d}>
                <h4>{d}</h4>
                <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>Consultations, diagnostics and treatment under the {d} department.</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Doctors" && (
          relatedDoctors.length ? (
            <div className="grid-cards grid-3">{relatedDoctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>
          ) : <EmptyState type="search" title="No doctors listed yet" message="Check back soon for staff doctor profiles." />
        )}

        {tab === "Treatments" && (
          relatedTreatments.length ? (
            <div className="grid-cards grid-3">
              {relatedTreatments.map((t) => (
                <div className="card" style={{ padding: 20 }} key={t.id}>
                  <span className="badge badge-neutral">{t.specialty}</span>
                  <h4 className="mt-8">{t.name}</h4>
                  <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{t.desc}</p>
                </div>
              ))}
            </div>
          ) : <EmptyState type="search" title="No treatments listed" message="This hospital hasn't published treatment details yet." />
        )}

        {tab === "Services" && (
          <div className="grid-cards grid-4">
            {hospital.facilities.map((f) => (
              <div className="card" style={{ padding: 18, textAlign: "center" }} key={f}><strong>{f}</strong></div>
            ))}
          </div>
        )}

        {tab === "Facilities" && (
          <ul className="facility-list">
            {hospital.facilities.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}

        {tab === "Reviews" && (
          <div>
            <div className="review-summary">
              <div>
                <strong style={{ fontSize: "2.5rem" }}>{hospital.rating}</strong>
                <Rating value={hospital.rating} count={hospital.reviews} />
              </div>
            </div>
            <div className="review-list mt-24">
              {REVIEWS.map((r) => (
                <div className="card" style={{ padding: 18 }} key={r.name}>
                  <div className="flex-between"><strong>{r.name}</strong><Rating value={r.rating} /></div>
                  <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Location" && (
          <div className="card" style={{ padding: 24 }}>
            <p><MapPin size={16} /> {hospital.address}</p>
            <iframe
              className="map-embed mt-16"
              title={`${hospital.name} location`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(buildMapQuery(hospital))}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {hospital.mapLink && (
              <a href={hospital.mapLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-16">
                <Navigation size={14} /> Open in Google Maps
              </a>
            )}
          </div>
        )}
      </div>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Get Directions">
        <p className="text-muted">{hospital.address}</p>
        <a className="btn btn-primary btn-block mt-16" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      </Modal>
    </div>
  );
}
