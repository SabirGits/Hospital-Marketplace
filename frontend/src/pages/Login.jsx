import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Building2, Stethoscope, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";
import GoogleSignInButton from "../components/GoogleSignInButton";

const TABS = [
  { key: "patient", label: "Patient", icon: User },
  { key: "hospital", label: "Hospital", icon: Building2 },
  { key: "clinic", label: "Clinic", icon: Stethoscope },
  { key: "medical", label: "Medical", icon: Briefcase },
  { key: "admin", label: "Admin", icon: ShieldCheck },
];

export default function Login() {
  const [tab, setTab] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [patientForm, setPatientForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login, googleLogin, patientLogin, dashboardPath } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const selectTab = (key) => {
    if (key === "admin") { navigate("/admin/login"); return; }
    setTab(key);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      showToast("Welcome back!");
      navigate(dashboardPath());
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await patientLogin(patientForm);
      showToast(`Welcome, ${patientForm.name}!`);
      navigate("/");
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(async (credential) => {
    try {
      await googleLogin(credential);
      showToast("Welcome back!");
      navigate(dashboardPath());
    } catch (err) {
      showToast(err.message);
    }
  }, [googleLogin, navigate, dashboardPath, showToast]);

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <Link to="/" className="brand" style={{ color: "var(--white)" }}>
          <span className="brand-mark"><Logo size={22} /></span>
          Hospital Marketplace
        </Link>
        <h2>Find Trusted Healthcare. Choose With Confidence.</h2>
        <p>Log in to your provider dashboard to manage your listing, or continue as a patient to browse and book.</p>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="login-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`login-tab ${tab === t.key ? "active" : ""} ${t.key === "admin" ? "login-tab-admin" : ""}`}
                onClick={() => selectTab(t.key)}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {tab === "patient" ? (
            <>
              <h2>Continue as Patient</h2>
              <p className="text-muted mb-24">Just your name and email — no password needed to browse, save favorites and book appointments.</p>
              <form onSubmit={submitPatient}>
                <div className="field"><label>Your Name</label><input required value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} /></div>
                <div className="field"><label>Email</label><input type="email" required value={patientForm.email} onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })} /></div>
                <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Continuing…" : "Continue"}</button>
              </form>
            </>
          ) : (
            <>
              <h2>Log In</h2>
              <p className="text-muted mb-24" style={{ textTransform: "capitalize" }}>
                {tab} account · New here? <Link to={`/register?role=${tab}`}>Create an account</Link>
              </p>

              <form onSubmit={submit}>
                <div className="field">
                  <label>Email</label>
                  <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="flex-between mb-16">
                  <label className="check-row"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label>
                  <Link to="/forgot-password" className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Forgot Password?</Link>
                </div>
                <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Logging in…" : "Login"}</button>
              </form>

              <div className="auth-divider"><span>or</span></div>
              <GoogleSignInButton onCredential={handleGoogleCredential} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
