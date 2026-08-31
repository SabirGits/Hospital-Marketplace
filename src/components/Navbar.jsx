import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, User, LayoutDashboard, Heart, Settings, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useNotifications from "../hooks/useNotifications";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/doctors", label: "Doctors" },
  { to: "/clinics", label: "Clinics" },
  { to: "/treatments", label: "Treatments" },
  { to: "/services", label: "Services" },
  { to: "/cities", label: "Cities" },
];

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const recipient = user ? (user.role === "admin" ? "admin" : user.email) : null;
  const { items: notifications, remove: removeNotification, clearAll: clearAllNotifications } = useNotifications(recipient);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark"><Logo size={22} /></span>
          Hospital Marketplace
        </Link>

        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <div className="nav-mobile-actions">
            <Link to="/register?role=hospital" className="btn btn-outline btn-block" onClick={() => setMobileOpen(false)}>List Your Hospital</Link>
            {!user ? (
              <Link to="/login" className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>Login</Link>
            ) : (
              <Link to={dashboardPath()} className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          <Link to="/register?role=hospital" className="btn btn-outline btn-sm desktop-only">List Your Hospital</Link>

          {user && (
            <div className="icon-dropdown" ref={notifRef}>
              <button className="btn-icon btn-ghost" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                <Bell size={18} />
                {notifications.length > 0 && <span className="notif-dot" />}
              </button>
              {notifOpen && (
                <div className="dropdown-panel">
                  <div className="dropdown-title-row">
                    <p className="dropdown-title" style={{ padding: 0 }}>Notifications</p>
                    {notifications.length > 0 && (
                      <button className="clear-all-btn" onClick={clearAllNotifications}>Clear all</button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-muted" style={{ fontSize: "var(--fs-xs)", padding: "10px" }}>No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div className="dropdown-item notif-item" key={n._id}>
                        <div>
                          <p>{n.message}</p>
                          <span className="text-muted" style={{ fontSize: "var(--fs-xs)" }}>{timeAgo(n.createdAt)}</span>
                        </div>
                        <button className="btn-icon btn-ghost notif-delete" onClick={() => removeNotification(n._id)} aria-label="Dismiss">
                          <X size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {!user ? (
            <Link to="/login" className="btn btn-primary btn-sm desktop-only">Login</Link>
          ) : (
            <div className="icon-dropdown" ref={profileRef}>
              <button className="profile-pill" onClick={() => setProfileOpen((v) => !v)}>
                <span className="avatar-circle">{user.name?.[0]?.toUpperCase() || "U"}</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dropdown-panel">
                  <Link to="/profile" className="dropdown-link" onClick={() => setProfileOpen(false)}><User size={14} /> Profile</Link>
                  <Link to={dashboardPath()} className="dropdown-link" onClick={() => setProfileOpen(false)}><LayoutDashboard size={14} /> Dashboard</Link>
                  <Link to="/favorites" className="dropdown-link" onClick={() => setProfileOpen(false)}><Heart size={14} /> Favorites</Link>
                  <Link to={`${dashboardPath()}?tab=settings`} className="dropdown-link" onClick={() => setProfileOpen(false)}><Settings size={14} /> Settings</Link>
                  <button className="dropdown-link" onClick={() => { logout(); setProfileOpen(false); navigate("/"); }}><LogOut size={14} /> Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="btn-icon btn-ghost mobile-only" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
