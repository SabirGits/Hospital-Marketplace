import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

export default function Services() {
  return (
    <>
      <div className="page-intro">
        <div className="container">
          <div className="section-head">
            <div><span className="eyebrow">Healthcare Services</span><h2>Browse Services</h2></div>
          </div>
        </div>
      </div>
      <div className="container section" style={{ paddingTop: 0 }}>
        <div className="grid-cards grid-4">
          {services.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>
      </div>
    </>
  );
}
