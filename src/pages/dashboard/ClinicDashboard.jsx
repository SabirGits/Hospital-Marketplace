import { useState } from "react";
import { LayoutDashboard, UserCircle2, ListChecks, Stethoscope, MessageSquare, BarChart3, Settings, Eye, Phone, Star } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import MiniBarChart from "../../components/MiniBarChart";
import { clinics } from "../../data/clinics";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { key: "profile", label: "Profile", icon: UserCircle2 },
  { key: "services", label: "Services", icon: ListChecks },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "reviews", label: "Reviews", icon: MessageSquare },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

const trafficData = [
  { label: "Mon", value: 40 }, { label: "Tue", value: 55 }, { label: "Wed", value: 48 },
  { label: "Thu", value: 70 }, { label: "Fri", value: 65 }, { label: "Sat", value: 52 }, { label: "Sun", value: 30 },
];

export default function ClinicDashboard() {
  const [tab, setTab] = useState("profile");
  const [clinic] = useState(clinics[0]);
  const [profile, setProfile] = useState({ name: clinic.name, specialty: clinic.specialty, location: clinic.location, hours: clinic.hours, services: clinic.services.join(", ") });
  const { showToast } = useToast();

  return (
    <DashboardLayout title={NAV.find((n) => n.key === tab)?.label} roleLabel="Clinic" items={NAV} activeKey={tab} onSelect={setTab}>
      {tab === "profile" && (
        <form className="card" style={{ padding: 24, maxWidth: 640 }} onSubmit={(e) => { e.preventDefault(); showToast("Clinic profile updated"); }}>
          <div className="field"><label>Clinic Name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="field-row">
            <div className="field"><label>Specialty</label><input value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} /></div>
            <div className="field"><label>Location</label><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></div>
          </div>
          <div className="field"><label>Opening Hours</label><input value={profile.hours} onChange={(e) => setProfile({ ...profile, hours: e.target.value })} /></div>
          <div className="field"><label>Services</label><input value={profile.services} onChange={(e) => setProfile({ ...profile, services: e.target.value })} /></div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      )}

      {tab === "services" && (
        <div className="grid-cards grid-3">
          {clinic.services.map((s) => (
            <div className="card flex-between" style={{ padding: 16 }} key={s}>
              <span>{s}</span><span className="badge badge-open">Active</span>
            </div>
          ))}
        </div>
      )}

      {tab === "doctors" && (
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <p className="text-muted">No doctors added yet — invite doctors to join this clinic's profile.</p>
          <button className="btn btn-primary mt-16" onClick={() => showToast("Invite sent (demo)")}>Invite a Doctor</button>
        </div>
      )}

      {tab === "reviews" && (
        <div className="grid-cards grid-3">
          {["Quick appointment scheduling.", "Friendly front desk staff.", "Very hygienic clinic."].map((r, i) => (
            <div className="card" style={{ padding: 18 }} key={i}>
              <div className="rating"><Star size={14} fill="currentColor" style={{ color: "var(--amber-500)" }} /> {(4 + i * 0.2).toFixed(1)}</div>
              <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{r}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div className="card" style={{ padding: 24 }}>
          <h4 className="mb-16">Weekly Visits</h4>
          <MiniBarChart data={trafficData} />
          <div className="grid-cards grid-3 mt-24">
            <StatCard icon={Eye} label="Profile Views" value="1,204" />
            <StatCard icon={Phone} label="Calls" value="96" />
            <StatCard icon={ListChecks} label="Appointments" value="58" />
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <h4 className="mb-16">Account Settings</h4>
          <div className="field"><label>Contact Phone</label><input defaultValue={clinic.phone} /></div>
          <label className="check-row mb-16"><input type="checkbox" defaultChecked /> Email me new review alerts</label>
          <button className="btn btn-primary" onClick={() => showToast("Settings saved")}>Save Settings</button>
        </div>
      )}
    </DashboardLayout>
  );
}
