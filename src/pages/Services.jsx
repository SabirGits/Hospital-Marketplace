import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

export default function Services() {
  return (
    <div className="container section">
      <div className="section-head">
        <div><span className="eyebrow">Healthcare Services</span><h2>Browse Services</h2></div>
      </div>
      <div className="grid-cards grid-4">
        {services.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
}
