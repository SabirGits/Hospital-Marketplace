import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { submitContactForm } from "../api/api";
import { useToast } from "../context/ToastContext";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await submitContactForm(form);
    setSubmitting(false);
    setForm({ name: "", email: "", message: "" });
    showToast("Your message has been sent.");
  };

  return (
    <div className="container section">
      <div className="contact-grid">
        <div>
          <span className="eyebrow">Get in Touch</span>
          <h1>Contact Us</h1>
          <p className="text-muted mt-16">Have a question about a listing, or want to talk partnership? Reach out.</p>
          <div className="contact-info mt-24">
            <p><Mail size={16} /> support@hospitalmarketplace.in</p>
            <p><Phone size={16} /> +91 141 400 5000</p>
            <p><MapPin size={16} /> Jaipur, Rajasthan, India</p>
          </div>
        </div>
        <form className="card contact-form" onSubmit={submit}>
          <div className="field">
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</button>
        </form>
      </div>
    </div>
  );
}
