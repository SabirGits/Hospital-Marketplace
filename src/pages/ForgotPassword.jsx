import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { requestPasswordReset, verifyResetCode, resetPassword } from "../api/api";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";

const STEPS = ["Enter Email", "Verify", "New Password", "Done"];

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const submitEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await requestPasswordReset(email);
      // No email service yet — surface the code directly so this is testable.
      showToast(`Demo mode — your reset code is ${res.demoCode}`);
      setStep(1);
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await verifyResetCode(email, code);
      setStep(2);
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { showToast("Passwords do not match"); return; }
    setSubmitting(true);
    try {
      await resetPassword(email, code, password);
      setStep(3);
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <Link to="/" className="brand" style={{ color: "var(--white)" }}>
          <span className="brand-mark"><Logo size={22} /></span>
          Hospital Marketplace
        </Link>
        <h2>Reset access to your account</h2>
        <p>Follow the steps to securely reset your password.</p>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-box">
          <div className="step-indicator">
            {STEPS.map((s, i) => (
              <span key={s} className={`step-dot ${i <= step ? "active" : ""}`}>{i + 1}</span>
            ))}
          </div>

          {step === 0 && (
            <form onSubmit={submitEmail}>
              <h2>Forgot Password</h2>
              <p className="text-muted mb-24">Enter the email linked to your hospital, clinic or medical account.</p>
              <div className="field"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Sending…" : "Send Verification Code"}</button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={submitCode}>
              <h2>Verify Code</h2>
              <p className="text-muted mb-24">Enter the 6-digit code sent to {email}.</p>
              <div className="field"><label>Verification Code</label><input required maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} /></div>
              <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Verifying…" : "Verify"}</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={submitPassword}>
              <h2>Set New Password</h2>
              <div className="field"><label>New Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <div className="field"><label>Confirm Password</label><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
              <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Saving…" : "Reset Password"}</button>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <Check size={40} style={{ color: "var(--teal-600)", margin: "0 auto 16px" }} />
              <h2>Password Reset</h2>
              <p className="text-muted mt-8">You can now log in with your new password.</p>
              <Link to="/login" className="btn btn-primary btn-block mt-24">Back to Login</Link>
            </div>
          )}

          <p className="field-hint mt-16" style={{ textAlign: "center" }}>
            Demo mode: no email is actually sent — the code shows up in a toast so you can test the flow.
          </p>
        </div>
      </div>
    </div>
  );
}
