import CityCard from "../components/CityCard";
import { cities } from "../data/cities";

export default function Cities() {
  return (
    <div className="container section">
      <div className="section-head">
        <div><span className="eyebrow">Nationwide Coverage</span><h2>Healthcare City Directory</h2></div>
      </div>
      <div className="grid-cards grid-5">
        {cities.map((c) => <CityCard key={c.id} city={c} />)}
      </div>
    </div>
  );
}
