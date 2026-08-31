import { useState, useEffect } from "react";
import {
  LayoutDashboard, Building2, Stethoscope, Briefcase, UserCircle2, Users, MessageSquare,
  MapPinned, ListChecks, HeartPulse, ShieldCheck, FileBarChart, Settings, Eye, Check, X, Trash2,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import MiniBarChart from "../../components/MiniBarChart";
import Modal from "../../components/Modal";
import { hospitals } from "../../data/hospitals";
import { doctors } from "../../data/doctors";
import { clinics } from "../../data/clinics";
import { useToast } from "../../context/ToastContext";
import { getProviderRequests, approveProviderRequest, rejectProviderRequest, deleteProviderRequest } from "../../api/api";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "hospitals", label: "Hospitals", icon: Building2 },
  { key: "clinics", label: "Clinics", icon: Stethoscope },
  { key: "medical", label: "Medical Providers", icon: Briefcase },
  { key: "doctors", label: "Doctors", icon: UserCircle2 },
  { key: "users", label: "Users", icon: Users },
  { key: "reviews", label: "Reviews", icon: MessageSquare },
  { key: "cities", label: "Cities", icon: MapPinned },
  { key: "services", label: "Services", icon: ListChecks },
  { key: "treatments", label: "Treatments", icon: HeartPulse },
  { key: "verification", label: "Verification", icon: ShieldCheck },
  { key: "reports", label: "Reports", icon: FileBarChart },
  { key: "settings", label: "Settings", icon: Settings },
];

const growthData = [
  { label: "Mar", value: 40 }, { label: "Apr", value: 55 }, { label: "May", value: 62 },
  { label: "Jun", value: 78 }, { label: "Jul", value: 90 }, { label: "Aug", value: 104 },
];

function displayName(r) {
  return r.hospitalName || r.clinicName || r.businessName || r.name;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [queue, setQueue] = useState([]);
  const [viewing, setViewing] = useState(null);
  const { showToast } = useToast();

  const loadRequests = () => {
    getProviderRequests().then(setQueue);
  };

  useEffect(() => { loadRequests(); }, []);

  const decide = async (id, action) => {
    try {
      if (action === "approved") await approveProviderRequest(id);
      else await rejectProviderRequest(id);
      loadRequests();
      showToast(action === "approved" ? "Provider approved — they can now log in." : "Provider request rejected and removed.");
      setViewing(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  // Separate from reject: lets the admin take down a record at any time,
  // approved or not, without it counting as a "rejection".
  const removeRecord = async (id) => {
    try {
      await deleteProviderRequest(id);
      loadRequests();
      showToast("Record deleted.");
      setViewing(null);
    } catch (err) {
      showToast(err.message);
    }
  };

  const genericList = (title, rows, columns) => (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}>{r.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout title={NAV.find((n) => n.key === tab)?.label} roleLabel="Admin" items={NAV} activeKey={tab} onSelect={setTab}>
      {tab === "overview" && (
        <>
          <div className="grid-cards grid-4">
            <StatCard icon={Building2} label="Total Hospitals" value={hospitals.length} trend="+4%" />
            <StatCard icon={Stethoscope} label="Total Clinics" value={clinics.length} trend="+2%" />
            <StatCard icon={Briefcase} label="Medical Providers" value="86" trend="+6%" />
            <StatCard icon={UserCircle2} label="Total Doctors" value={doctors.length} trend="+9%" />
          </div>
          <div className="grid-cards grid-2 mt-16">
            <StatCard icon={ShieldCheck} label="Pending Verification" value={queue.filter((q) => q.status === "pending").length} />
            <StatCard icon={Users} label="New Users (7d)" value="312" trend="+11%" />
          </div>
          <div className="card mt-24" style={{ padding: 24 }}>
            <h4 className="mb-16">Platform Growth</h4>
            <MiniBarChart data={growthData} />
          </div>
        </>
      )}

      {tab === "hospitals" && genericList("Hospitals", hospitals.slice(0, 12).map((h) => [h.name, h.city, h.type, h.rating, h.verified ? "Verified" : "Unverified"]), ["Name", "City", "Type", "Rating", "Status"])}
      {tab === "clinics" && genericList("Clinics", clinics.map((c) => [c.name, c.city, c.specialty, c.rating]), ["Name", "City", "Specialty", "Rating"])}
      {tab === "medical" && genericList("Medical Providers", [["MediCare Diagnostics", "Jaipur", "Diagnostics"], ["QuickLab Services", "Delhi", "Laboratory"], ["HomeCare Plus", "Mumbai", "Home Healthcare"]], ["Business", "City", "Type"])}
      {tab === "doctors" && genericList("Doctors", doctors.slice(0, 12).map((d) => [d.name, d.specialty, d.hospital, d.rating]), ["Name", "Specialty", "Hospital", "Rating"])}
      {tab === "users" && genericList("Users", [["Ananya Rao", "ananya@example.com", "Patient"], ["Rohit Sharma", "rohit@example.com", "Patient"], ["Meena Kumari", "meena@example.com", "Patient"]], ["Name", "Email", "Role"])}
      {tab === "reviews" && genericList("Reviews", [["Alwar City Hospital", "5.0", "Anita R."], ["Jaipur Heart Institute", "4.6", "Vikas S."], ["Capital Multi-Specialty Hospital", "4.8", "Farah K."]], ["Provider", "Rating", "Reviewer"])}
      {tab === "cities" && genericList("Cities", [["Alwar", "24 Hospitals"], ["Jaipur", "96 Hospitals"], ["Delhi", "210 Hospitals"], ["Mumbai", "245 Hospitals"]], ["City", "Coverage"])}
      {tab === "services" && genericList("Services", [["Emergency Care", "180 providers"], ["Diagnostics", "240 providers"], ["Pharmacy", "310 providers"]], ["Service", "Providers"])}
      {tab === "treatments" && genericList("Treatments", [["Heart Treatment", "Cardiology"], ["Cancer Care", "Oncology"], ["Dental Treatment", "Dentistry"]], ["Treatment", "Specialty"])}

      {tab === "verification" && (
        <>
          <p className="text-muted mb-16">Review new hospital, clinic and medical provider registrations before they can log in.</p>
          {queue.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <p className="text-muted">No registration requests yet.</p>
            </div>
          ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Provider</th><th>Type</th><th>City</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.id}>
                    <td>{displayName(q)}</td><td style={{ textTransform: "capitalize" }}>{q.role}</td><td>{q.city || q.location}</td>
                    <td>{new Date(q.submittedAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${q.status === "approved" ? "badge-open" : q.status === "rejected" ? "badge-closed" : "badge-pending"}`}>{q.status}</span></td>
                    <td className="flex gap-8">
                      <button className="btn-icon btn-ghost" onClick={() => setViewing(q)} aria-label="View"><Eye size={15} /></button>
                      <button className="btn-icon btn-ghost" onClick={() => decide(q.id, "approved")} aria-label="Approve" style={{ color: "var(--teal-600)" }} disabled={q.status === "approved"}><Check size={15} /></button>
                      <button className="btn-icon btn-ghost" onClick={() => decide(q.id, "rejected")} aria-label="Reject" style={{ color: "var(--red-600)" }}><X size={15} /></button>
                      <button className="btn-icon btn-ghost" onClick={() => removeRecord(q.id)} aria-label="Delete" style={{ color: "var(--gray-500)" }} title="Delete this record entirely"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          <Modal open={!!viewing} onClose={() => setViewing(null)} title="Provider Submission">
            {viewing && (
              <div className="request-detail">
                <p><strong>{displayName(viewing)}</strong></p>
                <p className="text-muted mt-8" style={{ textTransform: "capitalize" }}>{viewing.role} account · submitted {new Date(viewing.submittedAt).toLocaleString()}</p>
                <div className="request-detail-grid mt-16">
                  <div><span>Contact Name</span><strong>{viewing.name}</strong></div>
                  <div><span>Email</span><strong>{viewing.email}</strong></div>
                  <div><span>Phone</span><strong>{viewing.phone}</strong></div>
                  <div><span>Location</span><strong>{viewing.location || viewing.city}</strong></div>
                  {viewing.website && <div><span>Website</span><strong>{viewing.website}</strong></div>}
                  {viewing.plan && <div><span>Plan Selected</span><strong style={{ textTransform: "capitalize" }}>{viewing.plan}</strong></div>}
                  {viewing.hospitalType && <div><span>Hospital Type</span><strong>{viewing.hospitalType}</strong></div>}
                  {viewing.address && <div><span>Address</span><strong>{viewing.address}</strong></div>}
                  {viewing.specialties && <div><span>Specialties</span><strong>{viewing.specialties}</strong></div>}
                  {"emergency" in viewing && <div><span>Emergency Services</span><strong>{viewing.emergency ? "Yes" : "No"}</strong></div>}
                  {viewing.services && <div><span>Services</span><strong>{viewing.services}</strong></div>}
                  {viewing.medicalType && <div><span>Medical Type</span><strong>{viewing.medicalType}</strong></div>}
                </div>
                {viewing.description && <p className="text-muted mt-16">{viewing.description}</p>}
                <div className="flex gap-12 mt-24">
                  <button className="btn btn-outline btn-block" onClick={() => decide(viewing.id, "rejected")}><X size={15} /> Reject</button>
                  <button className="btn btn-primary btn-block" onClick={() => decide(viewing.id, "approved")} disabled={viewing.status === "approved"}><Check size={15} /> Approve</button>
                </div>
                <button className="btn btn-ghost btn-block mt-8" onClick={() => removeRecord(viewing.id)} style={{ color: "var(--red-600)" }}><Trash2 size={15} /> Delete Record</button>
              </div>
            )}
          </Modal>
        </>
      )}

      {tab === "reports" && (
        <div className="card" style={{ padding: 24 }}>
          <h4 className="mb-16">Monthly Report Summary</h4>
          <MiniBarChart data={growthData} />
        </div>
      )}

      {tab === "settings" && (
        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <h4 className="mb-16">Platform Settings</h4>
          <label className="check-row mb-16"><input type="checkbox" defaultChecked /> Require verification for new listings</label>
          <label className="check-row mb-16"><input type="checkbox" defaultChecked /> Send weekly admin digest email</label>
          <button className="btn btn-primary" onClick={() => showToast("Settings saved")}>Save Settings</button>
        </div>
      )}
    </DashboardLayout>
  );
}
