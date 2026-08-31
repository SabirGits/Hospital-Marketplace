import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { adminLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminLogin(form);
      showToast("Welcome, Admin.");
      navigate("/admin");
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual admin-visual">
        <Link to="/" className="brand" style={{ color: "var(--white)" }}>
          <span className="brand-mark"><Logo size={22} /></span>
          Hospital Marketplace
        </Link>
        <h2><ShieldCheck size={26} style={{ verticalAlign: "-4px", marginRight: 8 }} />Admin Portal</h2>
        <p>Review and approve new hospital, clinic and medical provider registrations before they go live on the marketplace.</p>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2>Admin Login</h2>
          <p className="text-muted mb-24">This is a separate, restricted login — not for hospital, clinic or medical accounts.</p>

          <form onSubmit={submit}>
            <div className="field">
              <label>Admin Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Verifying…" : "Login to Admin Panel"}</button>
          </form>

          <p className="field-hint mt-16" style={{ textAlign: "center" }}>
            Demo credentials: <strong>admin@hospitalmarketplace.in</strong> / <strong>Admin@123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
