import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Stethoscope, Briefcase, ShieldCheck, Check, CreditCard, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";
import ImageUploadField from "../components/ImageUploadField";

const ROLES = [
  { value: "hospital", label: "Hospital", icon: Building2, desc: "List your hospital on the marketplace" },
  { value: "clinic", label: "Clinic", icon: Stethoscope, desc: "List your clinic and services" },
  { value: "medical", label: "Medical", icon: Briefcase, desc: "List a medical business or service" },
  { value: "admin", label: "Admin", icon: ShieldCheck, desc: "Coming soon — not yet supported by the backend", disabled: true },
];

const cities = ["Alwar", "Jaipur", "Delhi", "Gurgaon", "Mumbai", "Ahmedabad", "Udaipur", "Jodhpur", "Kota", "Chandigarh"];

const PLANS = [
  { id: "basic", name: "Basic", price: "Free", features: ["Standard listing", "Contact details visible", "Community reviews"] },
  { id: "verified", name: "Verified", price: "₹999 / mo", features: ["Trust-score badge", "Priority in search", "Analytics dashboard"] },
  { id: "premium", name: "Premium", price: "₹2,499 / mo", features: ["Everything in Verified", "Featured placement", "Dedicated support"] },
];

const STEPS = ["Account Type", "Business Details", "Plan & Payment", "Done"];

export default function Register() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(params.get("role") ? 1 : 0);
  const [role, setRole] = useState(params.get("role") || "");
  const [plan, setPlan] = useState("basic");
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", location: "", website: "", social: "", image: "",
    hospitalName: "", hospitalType: "", address: "", city: "", mapLink: "", specialties: "", emergency: false, description: "",
    clinicName: "", services: "",
    businessName: "", medicalType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const chooseRole = (r) => { if (r.disabled) return; setRole(r.value); setStep(1); };

  const goToPayment = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { showToast("Passwords do not match"); return; }
    setStep(2);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Note: plan/payment aren't stored by the backend yet (no fields for
      // them on the User model) — this stays a demo step until that's added.
      await register({ ...form, role });
      setStep(3);
      showToast(plan === "basic" ? "Account created. You can now log in." : "Payment successful — account created.");
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isFree = plan === "basic";

  return (
    <div className="container section">
      <div className="flex-center" style={{ flexDirection: "column", marginBottom: 24 }}>
        <Link to="/" className="brand"><span className="brand-mark"><Logo size={22} /></span>Hospital Marketplace</Link>
        <h1 className="mt-16">Create Your Account</h1>
      </div>

      <div className="reg-stepper">
        {STEPS.map((s, i) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className={`reg-step ${step === i ? "active" : step > i ? "done" : ""}`}>
              <span className="reg-step-num">{step > i ? <Check size={13} /> : i + 1}</span> {s}
            </span>
            {i < STEPS.length - 1 && <span className="reg-step-line" />}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="role-select-grid">
          <h3 style={{ gridColumn: "1 / -1" }}>Choose Account Type</h3>
          {ROLES.map((r) => (
            <button key={r.value} className={`role-card ${r.disabled ? "disabled" : ""}`} onClick={() => chooseRole(r)} disabled={r.disabled}>
              <r.icon size={26} />
              <strong>{r.label}</strong>
              <span>{r.desc}</span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <form className="card register-form" onSubmit={goToPayment}>
          <div className="flex-between mb-24">
            <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>{role} Account</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>Change Type</button>
          </div>

          <h4 className="mb-16">Basic Information</h4>
          <div className="field-row">
            <div className="field"><label>Full Name</label><input required value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="field"><label>Phone</label><input required value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="field"><label>Location</label>
              <select required value={form.location} onChange={(e) => set("location", e.target.value)}>
                <option value="">Select City</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field"><label>Password</label><input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} /></div>
            <div className="field"><label>Confirm Password</label><input type="password" required value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Website (optional)</label><input value={form.website} onChange={(e) => set("website", e.target.value)} /></div>
            <div className="field"><label>Social Media (optional)</label><input value={form.social} onChange={(e) => set("social", e.target.value)} /></div>
          </div>
          <ImageUploadField label="Cover Photo (optional)" value={form.image} onChange={(v) => set("image", v)} />

          {role === "hospital" && (
            <>
              <h4 className="mb-16 mt-16">Hospital Details</h4>
              <div className="field-row">
                <div className="field"><label>Hospital Name</label><input required value={form.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} /></div>
                <div className="field"><label>Hospital Type</label>
                  <select required value={form.hospitalType} onChange={(e) => set("hospitalType", e.target.value)}>
                    <option value="">Select Type</option>
                    <option>General</option><option>Multi-Specialty</option><option>Super-Specialty</option><option>Specialty</option>
                  </select>
                </div>
              </div>
              <div className="field"><label>Address</label><input required value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="field"><label>City</label>
                <select required value={form.city} onChange={(e) => set("city", e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Google Maps Link (optional)</label>
                <input placeholder="Paste a Google Maps share link" value={form.mapLink} onChange={(e) => set("mapLink", e.target.value)} />
                <span className="field-hint">Open your hospital's location in Google Maps → Share → Copy link, and paste it here so patients can find you.</span>
              </div>
              <div className="field"><label>Specialties (comma separated)</label><input value={form.specialties} onChange={(e) => set("specialties", e.target.value)} /></div>
              <label className="check-row mb-16"><input type="checkbox" checked={form.emergency} onChange={(e) => set("emergency", e.target.checked)} /> Emergency Services Available</label>
              <div className="field"><label>Description</label><textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
            </>
          )}

          {role === "clinic" && (
            <>
              <h4 className="mb-16 mt-16">Clinic Details</h4>
              <div className="field-row">
                <div className="field"><label>Clinic Name</label><input required value={form.clinicName} onChange={(e) => set("clinicName", e.target.value)} /></div>
                <div className="field"><label>Specialty</label><input required value={form.hospitalType} onChange={(e) => set("hospitalType", e.target.value)} /></div>
              </div>
              <div className="field"><label>Address</label><input required value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="field"><label>City</label>
                <select required value={form.city} onChange={(e) => set("city", e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Services (comma separated)</label><input value={form.services} onChange={(e) => set("services", e.target.value)} /></div>
            </>
          )}

          {role === "medical" && (
            <>
              <h4 className="mb-16 mt-16">Medical Business Details</h4>
              <div className="field-row">
                <div className="field"><label>Business Name</label><input required value={form.businessName} onChange={(e) => set("businessName", e.target.value)} /></div>
                <div className="field"><label>Medical Type</label><input required value={form.medicalType} onChange={(e) => set("medicalType", e.target.value)} /></div>
              </div>
              <div className="field"><label>Location</label>
                <select required value={form.city} onChange={(e) => set("city", e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Services (comma separated)</label><input value={form.services} onChange={(e) => set("services", e.target.value)} /></div>
            </>
          )}

          {role === "admin" && (
            <>
              <h4 className="mb-16 mt-16">Admin Access</h4>
              <p className="text-muted">Admin accounts are reviewed manually before activation.</p>
            </>
          )}

          <button className="btn btn-primary btn-block mt-24">Continue to Plan & Payment</button>
          <p className="text-muted mt-16" style={{ textAlign: "center" }}>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      )}

      {step === 2 && (
        <form className="card register-form" onSubmit={submitPayment}>
          <h4 className="mb-16">Choose a Listing Plan</h4>
          <div className="plan-grid">
            {PLANS.map((p) => (
              <button type="button" key={p.id} className={`plan-card ${plan === p.id ? "active" : ""}`} onClick={() => setPlan(p.id)}>
                <strong>{p.name}</strong>
                <span className="plan-price">{p.price}</span>
                <ul>{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              </button>
            ))}
          </div>

          {!isFree && (
            <>
              <h4 className="mb-16 mt-16"><CreditCard size={16} /> Payment Details</h4>
              <div className="payment-card-preview">
                <div className="pc-row"><span>Hospital Marketplace</span><Lock size={14} /></div>
                <div className="pc-number">{payment.cardNumber ? payment.cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}</div>
                <div className="pc-row"><span>{payment.cardName || "CARDHOLDER NAME"}</span><span>{payment.expiry || "MM/YY"}</span></div>
              </div>
              <div className="field"><label>Cardholder Name</label><input required value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} /></div>
              <div className="field"><label>Card Number</label>
                <input required maxLength={16} placeholder="1234 5678 9012 3456" value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value.replace(/\D/g, "") })} />
              </div>
              <div className="field-row">
                <div className="field"><label>Expiry</label><input required placeholder="MM/YY" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} /></div>
                <div className="field"><label>CVV</label><input required maxLength={3} placeholder="123" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "") })} /></div>
              </div>
              <p className="field-hint mb-16"><Lock size={11} /> Demo payment form — no real transaction is processed.</p>
            </>
          )}

          <div className="flex gap-12">
            <button type="button" className="btn btn-outline btn-block" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Processing…" : isFree ? "Create Account" : `Pay & Create Account`}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <Check size={46} style={{ color: "var(--teal-600)", margin: "0 auto 16px" }} />
          <h2>Request Submitted</h2>
          <p className="text-muted mt-8">Your {role} account on the <strong style={{ textTransform: "capitalize" }}>{plan}</strong> plan has been submitted for admin review.</p>
          <p className="text-muted mt-8">You'll be able to log in once an admin approves your request.</p>
          <button className="btn btn-primary mt-24" onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      )}
    </div>
  );
}
