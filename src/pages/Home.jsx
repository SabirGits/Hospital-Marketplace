import { Link } from "react-router-dom";
import { ShieldCheck, ListChecks, MapPinned, Scale, ArrowRight, Building2 } from "lucide-react";
import SearchBar from "../components/SearchBar";
import HospitalCard from "../components/HospitalCard";
import DoctorCard from "../components/DoctorCard";
import TreatmentCard from "../components/TreatmentCard";
import CityCard from "../components/CityCard";
import SpecialtyCard from "../components/SpecialtyCard";
import ImageWithFallback from "../components/ImageWithFallback";
import { hospitals } from "../data/hospitals";
import { doctors } from "../data/doctors";
import { treatments } from "../data/treatments";
import { cities } from "../data/cities";
import { specialties } from "../data/specialties";

const QUICK_SEARCHES = ["Hospitals in Alwar", "Best cardiologists", "Emergency hospitals", "Orthopedic specialists", "Cancer treatment"];

const STATS = [
  { value: "500+", label: "Hospitals" },
  { value: "1,500+", label: "Doctors" },
  { value: "50+", label: "Cities" },
  { value: "10,000+", label: "Healthcare Services" },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Verified Providers", desc: "Every listing carries a trust score backed by document checks." },
  { icon: ListChecks, title: "Trusted Listings", desc: "Curated hospital, clinic and doctor profiles you can rely on." },
  { icon: MapPinned, title: "Multiple Cities", desc: "Coverage across 50+ Indian cities and growing." },
  { icon: Scale, title: "Easy Comparison", desc: "Compare hospitals side-by-side before you decide." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Healthcare Marketplace</span>
            <h1>Find the Right Healthcare. Near You.</h1>
            <p className="hero-sub">Discover trusted hospitals, clinics, doctors and treatments across your city.</p>
            <SearchBar variant="hero" />
            <div className="quick-search-row">
              {QUICK_SEARCHES.map((q) => (
                <Link key={q} to={`/hospitals?q=${encodeURIComponent(q)}`} className="quick-chip">{q}</Link>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <ShieldCheck size={20} />
              <div>
                <strong>92% Trust Score</strong>
                <span>Verified provider network</span>
              </div>
            </div>
            <ImageWithFallback src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80" alt="Doctor consulting a patient" kind="doctor" />
            <div className="hero-card hero-card-2">
              <Building2 size={20} />
              <div>
                <strong>500+ Hospitals</strong>
                <span>Across 50+ cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container">
          <div className="stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="trust-points">
            {TRUST_POINTS.map((t) => (
              <div key={t.title} className="trust-point">
                <t.icon size={20} />
                <div>
                  <strong>{t.title}</strong>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Popular Categories</span><h2>Explore by Specialty</h2></div>
          </div>
          <div className="grid-cards grid-5">
            {specialties.slice(0, 10).map((s) => <SpecialtyCard key={s.id} specialty={s} />)}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Marketplace Picks</span><h2>Top Hospitals Near You</h2></div>
            <Link to="/hospitals" className="btn btn-outline btn-sm">View All Hospitals <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-cards grid-3">
            {hospitals.slice(0, 6).map((h) => <HospitalCard key={h.id} hospital={h} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Meet the Experts</span><h2>Top Doctors</h2></div>
            <Link to="/doctors" className="btn btn-outline btn-sm">View All Doctors <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-cards grid-3">
            {doctors.slice(0, 3).map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Care Pathways</span><h2>Popular Treatments</h2></div>
            <Link to="/treatments" className="btn btn-outline btn-sm">View All Treatments <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-cards grid-3">
            {treatments.slice(0, 6).map((t) => <TreatmentCard key={t.id} treatment={t} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Nationwide Coverage</span><h2>Browse by City</h2></div>
            <Link to="/cities" className="btn btn-outline btn-sm">View All Cities <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-cards grid-5">
            {cities.slice(0, 10).map((c) => <CityCard key={c.id} city={c} />)}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container why-grid">
          <div>
            <span className="eyebrow">Why Hospital Marketplace</span>
            <h2>Built for confident healthcare decisions</h2>
            <p className="hero-sub" style={{ marginTop: 12 }}>
              We verify every provider, surface transparent ratings and let you compare care options
              before you commit — so choosing a hospital feels as clear as choosing anything else online.
            </p>
            <ul className="why-list">
              <li><ShieldCheck size={16} /> Verification-first listings with trust scores</li>
              <li><Scale size={16} /> Side-by-side hospital comparison</li>
              <li><MapPinned size={16} /> Deep coverage across Indian cities</li>
              <li><ListChecks size={16} /> Transparent reviews from real patients</li>
            </ul>
          </div>
          <ImageWithFallback src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=80" alt="Modern hospital corridor" kind="hospital" className="why-image" />
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Are you a healthcare provider?</h2>
            <p>List your hospital, clinic or medical practice and reach patients across the country.</p>
          </div>
          <Link to="/register?role=hospital" className="btn btn-accent btn-lg">List Your Hospital</Link>
        </div>
      </section>
    </>
  );
}
