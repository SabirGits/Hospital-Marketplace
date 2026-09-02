import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

export default function CityCard({ city }) {
  return (
    <Link to={`/cities/${city.id}`} className="card card-hover city-card">
      <ImageWithFallback src={city.image} alt={`${city.name} skyline`} kind="city" />
      <div className="city-overlay">
        <h4>{city.name}</h4>
        <p>{city.hospitals} Hospitals · {city.doctors} Doctors · {city.clinics} Clinics</p>
        <span className="explore-link light">Explore <ArrowRight size={14} /></span>
      </div>
    </Link>
  );
}
