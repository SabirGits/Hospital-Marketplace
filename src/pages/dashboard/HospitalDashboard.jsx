import { useState } from "react";
import { LayoutDashboard, UserCircle2, Stethoscope, ListChecks, MessageSquare, BarChart3, Settings, Eye, Phone, Globe, Plus, Trash2, Star, Clock } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import MiniBarChart from "../../components/MiniBarChart";
import Modal from "../../components/Modal";
import { doctors as allDoctors, WEEKDAYS } from "../../data/doctors";
import { hospitals } from "../../data/hospitals";
import { useToast } from "../../context/ToastContext";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "profile", label: "Hospital Profile", icon: UserCircle2 },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "services", label: "Services", icon: ListChecks },
  { key: "reviews", label: "Reviews", icon: MessageSquare },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

const trafficData = [
  { label: "Mon", value: 120 }, { label: "Tue", value: 180 }, { label: "Wed", value: 150 },
  { label: "Thu", value: 220 }, { label: "Fri", value: 260 }, { label: "Sat", value: 190 }, { label: "Sun", value: 140 },
];

export default function HospitalDashboard() {
  const [tab, setTab] = useState("overview");
  const [hospital] = useState(hospitals[0]);
  const [profile, setProfile] = useState({ name: hospital.name, description: hospital.description, website: hospital.website, phone: hospital.phone, address: hospital.address, facilities: hospital.facilities.join(", "), departments: hospital.departments.join(", ") });
  const [doctorList, setDoctorList] = useState(allDoctors.filter((d) => d.hospitalId === hospital.id));
  const [addOpen, setAddOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" });
  const [scheduleDoctor, setScheduleDoctor] = useState(null);
  const [scheduleDraft, setScheduleDraft] = useState({});
  const { showToast } = useToast();

  const saveProfile = (e) => { e.preventDefault(); showToast("Hospital profile updated"); };

  const addDoctor = (e) => {
    e.preventDefault();
    setDoctorList((list) => [...list, { id: `temp-${Date.now()}`, name: newDoctor.name, specialty: newDoctor.specialty, rating: 0, reviews: 0, available: true, schedule: {} }]);
    setNewDoctor({ name: "", specialty: "" });
    setAddOpen(false);
    showToast("Doctor added");
  };

  const removeDoctor = (id) => { setDoctorList((list) => list.filter((d) => d.id !== id)); showToast("Doctor removed"); };

  const openSchedule = (doctor) => {
    setScheduleDoctor(doctor);
    setScheduleDraft(doctor.schedule || {});
  };

  const saveSchedule = (e) => {
    e.preventDefault();
    setDoctorList((list) => list.map((d) => (d.id === scheduleDoctor.id ? { ...d, schedule: scheduleDraft } : d)));
    showToast(`${scheduleDoctor.name}'s schedule updated`);
    setScheduleDoctor(null);
  };

  return (
    <DashboardLayout title={NAV.find((n) => n.key === tab)?.label} roleLabel="Hospital" items={NAV} activeKey={tab} onSelect={setTab}>
      {tab === "overview" && (
        <>
          <div className="grid-cards grid-4">
            <StatCard icon={Eye} label="Profile Views" value="4,820" trend="+12%" />
            <StatCard icon={ListChecks} label="Search Appearances" value="12,340" trend="+8%" />
            <StatCard icon={Globe} label="Website Clicks" value="612" trend="+3%" />
            <StatCard icon={Phone} label="Calls" value="284" trend="-2%" />
          </div>
          <div className="card mt-24" style={{ padding: 24 }}>
            <h4 className="mb-16">Weekly Profile Traffic</h4>
            <MiniBarChart data={trafficData} />
          </div>
        </>
      )}

      {tab === "profile" && (
        <form className="card" style={{ padding: 24, maxWidth: 640 }} onSubmit={saveProfile}>
          <div className="field"><label>Name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="field"><label>Description</label><textarea rows={4} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} /></div>
          <div className="field-row">
            <div className="field"><label>Website</label><input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} /></div>
            <div className="field"><label>Phone</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          </div>
          <div className="field"><label>Address</label><input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
          <div className="field"><label>Facilities</label><input value={profile.facilities} onChange={(e) => setProfile({ ...profile, facilities: e.target.value })} /></div>
          <div className="field"><label>Departments</label><input value={profile.departments} onChange={(e) => setProfile({ ...profile, departments: e.target.value })} /></div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      )}

      {tab === "doctors" && (
        <>
          <div className="flex-between mb-16">
            <p className="text-muted">{doctorList.length} doctors on staff</p>
            <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}><Plus size={14} /> Add Doctor</button>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Name</th><th>Specialty</th><th>Rating</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {doctorList.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td><td>{d.specialty}</td>
                    <td><Star size={13} fill="currentColor" style={{ color: "var(--amber-500)" }} /> {d.rating || "—"}</td>
                    <td><span className={`badge ${d.available ? "badge-open" : "badge-closed"}`}>{d.available ? "Available" : "Unavailable"}</span></td>
                    <td className="flex gap-8">
                      <button className="btn-icon btn-ghost" onClick={() => openSchedule(d)} aria-label="Edit schedule" title="Edit sitting schedule"><Clock size={15} /></button>
                      <button className="btn-icon btn-ghost" onClick={() => removeDoctor(d.id)} aria-label="Remove"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Doctor">
            <form onSubmit={addDoctor}>
              <div className="field"><label>Name</label><input required value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} /></div>
              <div className="field"><label>Specialty</label><input required value={newDoctor.specialty} onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })} /></div>
              <button className="btn btn-primary btn-block">Add Doctor</button>
            </form>
          </Modal>
          <Modal open={!!scheduleDoctor} onClose={() => setScheduleDoctor(null)} title={scheduleDoctor ? `${scheduleDoctor.name}'s Sitting Schedule` : "Schedule"}>
            {scheduleDoctor && (
              <form onSubmit={saveSchedule}>
                <p className="text-muted mb-16" style={{ fontSize: "var(--fs-sm)" }}>
                  Set the time this doctor sits each day. Leave a day blank if they're off — patients booking on
                  that day will see "not available".
                </p>
                <div className="schedule-editor">
                  {WEEKDAYS.map((day) => (
                    <div className="schedule-row" key={day}>
                      <label>{day}</label>
                      <input
                        type="text"
                        placeholder="Off"
                        value={scheduleDraft[day] || ""}
                        onChange={(e) => setScheduleDraft({ ...scheduleDraft, [day]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-block mt-16">Save Schedule</button>
              </form>
            )}
          </Modal>
        </>
      )}

      {tab === "services" && (
        <div className="grid-cards grid-3">
          {hospital.facilities.map((f) => (
            <div className="card flex-between" style={{ padding: 16 }} key={f}>
              <span>{f}</span>
              <span className="badge badge-open">Active</span>
            </div>
          ))}
        </div>
      )}

      {tab === "reviews" && (
        <div className="grid-cards grid-3">
          {["Fast emergency response.", "Clean and well organized.", "Doctors were very attentive."].map((r, i) => (
            <div className="card" style={{ padding: 18 }} key={i}>
              <div className="rating"><Star size={14} fill="currentColor" style={{ color: "var(--amber-500)" }} /> {(4 + i * 0.3).toFixed(1)}</div>
              <p className="text-muted mt-8" style={{ fontSize: "var(--fs-sm)" }}>{r}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "analytics" && (
        <div className="card" style={{ padding: 24 }}>
          <h4 className="mb-16">Profile Views vs Website Visits</h4>
          <MiniBarChart data={trafficData} />
          <div className="grid-cards grid-3 mt-24">
            <StatCard icon={Eye} label="Search Impressions" value="9,140" />
            <StatCard icon={Phone} label="Calls This Month" value="284" />
            <StatCard icon={Globe} label="Website Visits" value="612" />
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="card" style={{ padding: 24, maxWidth: 480 }}>
          <h4 className="mb-16">Account Settings</h4>
          <div className="field"><label>Notification Email</label><input defaultValue={hospital.email} /></div>
          <label className="check-row mb-16"><input type="checkbox" defaultChecked /> Email me new review alerts</label>
          <button className="btn btn-primary" onClick={() => showToast("Settings saved")}>Save Settings</button>
        </div>
      )}
    </DashboardLayout>
  );
}
