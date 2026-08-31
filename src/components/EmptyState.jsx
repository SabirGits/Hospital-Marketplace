import { SearchX, AlertTriangle, HeartOff, MessageSquareOff } from "lucide-react";

const ICONS = { search: SearchX, error: AlertTriangle, favorites: HeartOff, reviews: MessageSquareOff };

export default function EmptyState({ type = "search", title, message, actionLabel, onAction }) {
  const Icon = ICONS[type] || SearchX;
  return (
    <div className="state-block">
      <Icon />
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button className="btn btn-primary mt-16" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
