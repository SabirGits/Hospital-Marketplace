import { useState, useEffect } from "react";
import Modal from "./Modal";
import ImageUploadField from "./ImageUploadField";
import { updateProviderRequest } from "../api/api";
import { useToast } from "../context/ToastContext";

// One form that adapts its fields to whichever role is being edited —
// hospital/clinic/medical records all live in the same collection, so this
// covers all three instead of building three near-identical modals.
export default function ProviderEditModal({ record, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (record) setForm({ ...record });
  }, [record]);

  if (!record) return null;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProviderRequest(record.id, form);
      showToast("Record updated.");
      onSaved();
    } catch (err) {
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={!!record} onClose={onClose} title={`Edit ${record.role} record`}>
      <form onSubmit={save}>
        <ImageUploadField label="Photo" value={form.image || ""} onChange={(v) => set("image", v)} />
        <div className="field"><label>Contact Name</label><input value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
        <div className="field-row">
          <div className="field"><label>Email</label><input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="field"><label>Phone</label><input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
        </div>

        {record.role === "hospital" && (
          <>
            <div className="field"><label>Hospital Name</label><input value={form.hospitalName || ""} onChange={(e) => set("hospitalName", e.target.value)} /></div>
            <div className="field-row">
              <div className="field"><label>Hospital Type</label><input value={form.hospitalType || ""} onChange={(e) => set("hospitalType", e.target.value)} /></div>
              <div className="field"><label>City</label><input value={form.city || ""} onChange={(e) => set("city", e.target.value)} /></div>
            </div>
            <div className="field"><label>Address</label><input value={form.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="field"><label>Specialties</label><input value={form.specialties || ""} onChange={(e) => set("specialties", e.target.value)} /></div>
            <label className="check-row mb-16"><input type="checkbox" checked={!!form.emergency} onChange={(e) => set("emergency", e.target.checked)} /> Emergency Services</label>
            <div className="field"><label>Description</label><textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></div>
          </>
        )}

        {record.role === "clinic" && (
          <>
            <div className="field"><label>Clinic Name</label><input value={form.clinicName || ""} onChange={(e) => set("clinicName", e.target.value)} /></div>
            <div className="field"><label>Address</label><input value={form.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="field"><label>Services</label><input value={form.services || ""} onChange={(e) => set("services", e.target.value)} /></div>
          </>
        )}

        {record.role === "medical" && (
          <>
            <div className="field"><label>Business Name</label><input value={form.businessName || ""} onChange={(e) => set("businessName", e.target.value)} /></div>
            <div className="field"><label>Medical Type</label><input value={form.medicalType || ""} onChange={(e) => set("medicalType", e.target.value)} /></div>
            <div className="field"><label>Services</label><input value={form.services || ""} onChange={(e) => set("services", e.target.value)} /></div>
          </>
        )}

        <button className="btn btn-primary btn-block mt-16" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
      </form>
    </Modal>
  );
}
