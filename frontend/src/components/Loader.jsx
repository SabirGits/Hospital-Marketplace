export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="skeleton" style={{ height: 150, marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: "50%", marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 12, width: "90%" }} />
    </div>
  );
}

export default function Loader({ count = 6 }) {
  return (
    <div className="grid-cards">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
