import { useParams } from "react-router-dom";
import { getCityById } from "../data/cities";
import { hospitals } from "../data/hospitals";
import { doctors } from "../data/doctors";
import { clinics } from "../data/clinics";
import { treatments } from "../data/treatments";
import HospitalCard from "../components/HospitalCard";
import DoctorCard from "../components/DoctorCard";
import ClinicCard from "../components/ClinicCard";
import TreatmentCard from "../components/TreatmentCard";
import EmptyState from "../components/EmptyState";
import ImageWithFallback from "../components/ImageWithFallback";

export default function CityDetails() {
  const { id } = useParams();
  const city = getCityById(id);

  if (!city) {
    return <div className="container section"><EmptyState type="search" title="City not found" message="This city page doesn't exist yet." /></div>;
  }

  const cityHospitals = hospitals.filter((h) => h.city === city.name);
  const emergencyHospitals = cityHospitals.filter((h) => h.emergency);
  const cityDoctors = doctors.filter((d) => d.city === city.name);
  const cityClinics = clinics.filter((c) => c.city === city.name);

  return (
    <>
      <div className="city-hero">
        <ImageWithFallback src={city.image} alt={`${city.name} skyline`} kind="city" className="city-hero-img" />
        <div className="city-hero-overlay" />
        <div className="container city-hero-content">
          <span className="eyebrow" style={{ color: "var(--white)" }}>Healthcare Directory</span>
          <h1 style={{ color: "var(--white)" }}>Healthcare in {city.name}</h1>
          <p style={{ color: "rgba(255,255,255,.85)" }}>{city.hospitals} Hospitals · {city.doctors} Doctors · {city.clinics} Clinics</p>
        </div>
      </div>

      <div className="container section">
        <div className="section-head"><div><h2>Top Hospitals</h2></div></div>
        {cityHospitals.length ? <div className="grid-cards grid-3">{cityHospitals.slice(0, 6).map((h) => <HospitalCard key={h.id} hospital={h} />)}</div>
          : <EmptyState type="search" title="No hospitals listed yet" message={`We're onboarding hospitals in ${city.name} soon.`} />}
      </div>

      {cityDoctors.length > 0 && (
        <div className="container section section-tint">
          <div className="section-head"><div><h2>Top Doctors</h2></div></div>
          <div className="grid-cards grid-3">{cityDoctors.slice(0, 3).map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>
        </div>
      )}

      {cityClinics.length > 0 && (
        <div className="container section">
          <div className="section-head"><div><h2>Clinics</h2></div></div>
          <div className="grid-cards grid-4">{cityClinics.slice(0, 4).map((c) => <ClinicCard key={c.id} clinic={c} />)}</div>
        </div>
      )}

      <div className="container section section-tint">
        <div className="section-head"><div><h2>Popular Treatments</h2></div></div>
        <div className="grid-cards grid-3">{treatments.slice(0, 3).map((t) => <TreatmentCard key={t.id} treatment={t} />)}</div>
      </div>

      {emergencyHospitals.length > 0 && (
        <div className="container section">
          <div className="section-head"><div><h2>Emergency Hospitals</h2></div></div>
          <div className="grid-cards grid-3">{emergencyHospitals.slice(0, 3).map((h) => <HospitalCard key={h.id} hospital={h} />)}</div>
        </div>
      )}
    </>
  );
}
