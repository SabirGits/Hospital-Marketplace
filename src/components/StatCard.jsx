export default function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="card stat-card">
      <div className="stat-card-icon"><Icon size={18} /></div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {trend && <span className={`stat-trend ${trend.startsWith("-") ? "down" : "up"}`}>{trend}</span>}
      </div>
    </div>
  );
}
