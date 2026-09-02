import { AlertTriangle } from "lucide-react";

export default function ErrorState({ onRetry }) {
  return (
    <div className="state-block">
      <AlertTriangle />
      <h3>Something went wrong</h3>
      <p>Please try again.</p>
      {onRetry && <button className="btn btn-primary mt-16" onClick={onRetry}>Try Again</button>}
    </div>
  );
}
