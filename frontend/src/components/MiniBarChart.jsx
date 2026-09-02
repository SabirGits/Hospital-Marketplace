export default function MiniBarChart({ data, valueKey = "value", labelKey = "label" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="mini-bar-chart">
      {data.map((d) => (
        <div className="mini-bar-col" key={d[labelKey]}>
          <div className="mini-bar" style={{ height: `${(d[valueKey] / max) * 100}%` }} title={`${d[labelKey]}: ${d[valueKey]}`} />
          <span>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
