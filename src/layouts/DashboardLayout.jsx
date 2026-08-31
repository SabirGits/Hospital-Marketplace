import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function DashboardLayout({ title, roleLabel, items, activeKey, onSelect, children }) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dash-shell">
      <aside className={`dash-sidebar ${open ? "open" : ""}`}>
        <Link to="/" className="brand" style={{ padding: "0 20px", marginBottom: 8 }}>
          <span className="brand-mark"><Logo size={22} /></span>
          Hospital Marketplace
        </Link>
        <p className="dash-role-label">{roleLabel} Panel</p>
        <nav className="dash-nav">
          {items.map((item) => (
            <button
              key={item.key}
              className={`dash-nav-link ${activeKey === item.key ? "active" : ""}`}
              onClick={() => { onSelect(item.key); setOpen(false); }}
            >
              <item.icon size={17} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="dash-sidebar-foot">
          <Link to="/" className="dash-nav-link"><ArrowLeft size={17} /> Back to site</Link>
          <button className="dash-nav-link" onClick={() => { logout(); navigate("/"); }}><LogOut size={17} /> Logout</button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="btn-icon btn-ghost mobile-only" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2>{title}</h2>
          <div className="flex-center gap-8">
            <span className="avatar-circle">{user?.name?.[0]?.toUpperCase() || "U"}</span>
          </div>
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
