import { useState, useEffect } from "react";
import { UserCircle2, ListChecks, MessageSquare, BarChart3, Settings, Eye, Phone, Star, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import MiniBarChart from "../../components/MiniBarChart";
import ImageUploadField from "../../components/ImageUploadField";
import { useToast } from "../../context/ToastContext";
import { getMyProfile, updateMyProfile } from "../../api/api";

const NAV = [
  { key: "profile", label: "Business Profile", icon: UserCircle2 },
  { key: "services", label: "Services", icon: ListChecks },
  { key: "requests", label: "Contact Requests", icon: MessageSquare },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

const trafficData = [
  { label: "Mon", value: 22 }, { label: "Tue", value: 30 }, { label: "Wed", value: 26 },
  { label: "Thu", value: 38 }, { label: "Fri", value: 34 }, { label: "Sat", value: 20 }, { label: "Sun", value: 14 },
];

const REQUESTS = [
  { id: 1, name: "Ravi Kumar", service: "Diagnostics", date: "Aug 20, 2026" },
  { id: 2, name: "Sunita Devi", service: "Home Healthcare", date: "Aug 19, 2026" },
  { id: 3, name: "Amit Verma", service: "Pharmacy", date: "Aug 18, 2026" },
];

export default function MedicalDashboard() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ businessName: "MediCare Diagnostics", medicalType: "Diagnostics", location: "Jaipur", description: "Full-service diagnostic lab offering pathology and imaging.", image: "" });
  const [services, setServices] = useState(["Blood Testing", "X-Ray", "MRI Scan", "Home Sample Collection"]);
  const [newService, setNewService] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    getMyProfile()
      .then((real) => {
        setProfile((p) => ({
          ...p,
          businessName: real.businessName || real.name || p.businessName,
          medicalType: real.medicalType || p.medicalType,
          location: real.address || p.location,
          description: real.description || p.description,
          image: real.image || "",
        }));
      })
      .catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile({
        businessName: profile.businessName,
        medicalType: profile.medicalType,
        address: profile.location,
        description: profile.description,
        image: profile.image,
      });
      showToast("Business profile updated");
    } catch (err) {
      showToast(err.message || "Couldn't save changes");
    }
  };

  const addService = () => { if (!newService.trim()) return; setServices((s) => [...s, newService.trim()]); setNewService(""); };
  const removeService = (s) => setServices((list) => list.filter((x) => x !== s));

  return (
    <DashboardLayout title={NAV.find((n) => n.key === tab)?.label} roleLabel="Medical" items={NAV} activeKey={tab} onSelect={setTab}>
      {tab === "profile" && (
        <form className="card" style={{ padding: 24, maxWidth: 640 }} onSubmit={saveProfile}>
          <ImageUploadField label="Business Photo" value={profile.image} onChange={(v) => setProfile({ ...profile, image: v })} />
          <div className="field"><label>Business Name</label><input value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} /></div>
          <div className="field-row">
            <div className="field"><label>Medical Type</label><input value={profile.medicalType} onChange={(e) => setProfile({ ...profile, medicalType: e.target.value })} /></div>
            <div className="field"><label>Location</label><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></div>
          </div>
          <div className="field"><label>Description</label><textarea rows={4} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} /></div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      )}

      {tab === "services" && (
        <div className="card" style={{ padding: 24, maxWidth: 560 }}>
          <div className="flex gap-8 mb-16">
            <input placeholder="Add a service" value={newService} onChange={(e) => setNewService(e.target.value)} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-strong)" }} />
            <button className="btn btn-primary btn-sm" onClick={addService}><Plus size={14} /> Add</button>
          </div>
          <ul className="facility-list">
            {services.map((s) => (
              <li key={s} className="flex-between">{s} <button className="btn-icon btn-ghost" onClick={() => removeService(s)}><Trash2 size={14} /></button></li>
            ))}
          </ul>
        </div>
      )}

      {tab === "requests" && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead><tr><th>Name</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {REQUESTS.map((r) => (
                <tr key={r.id}><td>{r.name}</td><td>{r.service}</td><td>{r.date}</td><td><span className="badge badge-pending">Pending</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "reviews" && (
        <div className="grid-cards grid-3">
          {["Accurate results, quick turnaround.", "Staff was courteous and professional.", "Home sample collection was on time."].map((r, i) => (
            <div className="card" style={{ padding: 18 }} key={i}>
              <div className="rating"><Star size={14} fill="currentColor" style={{ color: "var(--amber-500)" }} /> {(4.2 + i * 0.2).toFixed(1)}</div>
              <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{r}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div className="card" style={{ padding: 24 }}>
          <h4 className="mb-16">Weekly Contact Requests</h4>
          <MiniBarChart data={trafficData} />
          <div className="grid-cards grid-3 mt-24">
            <StatCard icon={Eye} label="Profile Views" value="842" />
            <StatCard icon={Phone} label="Calls" value="41" />
            <StatCard icon={ListChecks} label="Requests" value="27" />
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <h4 className="mb-16">Account Settings</h4>
          <div className="field"><label>Notification Email</label><input defaultValue="contact@medicare.in" /></div>
          <label className="check-row mb-16"><input type="checkbox" defaultChecked /> Email me new request alerts</label>
          <button className="btn btn-primary" onClick={() => showToast("Settings saved")}>Save Settings</button>
        </div>
      )}
    </DashboardLayout>
  );
}
