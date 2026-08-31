import { Link } from "react-router-dom";
import { Link2, AtSign, MessageCircle, PlaySquare } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand" style={{ color: "var(--white)" }}>
            <span className="brand-mark"><Logo size={22} /></span>
            Hospital Marketplace
          </span>
          <p className="footer-about">
            India's healthcare discovery marketplace — connecting patients with verified hospitals, clinics and doctors across the country.
          </p>
          <div className="social-row">
            <a href="#" aria-label="LinkedIn"><Link2 size={16} /></a>
            <a href="#" aria-label="Instagram"><AtSign size={16} /></a>
            <a href="#" aria-label="Facebook"><MessageCircle size={16} /></a>
            <a href="#" aria-label="YouTube"><PlaySquare size={16} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Discover</h5>
          <Link to="/hospitals">Hospitals</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/clinics">Clinics</Link>
          <Link to="/treatments">Treatments</Link>
          <Link to="/services">Services</Link>
        </div>

        <div className="footer-col">
          <h5>Cities</h5>
          <Link to="/cities/alwar">Alwar</Link>
          <Link to="/cities/jaipur">Jaipur</Link>
          <Link to="/cities/delhi">Delhi</Link>
          <Link to="/cities/gurgaon">Gurgaon</Link>
          <Link to="/cities/mumbai">Mumbai</Link>
        </div>

        <div className="footer-col">
          <h5>Providers</h5>
          <Link to="/register?role=hospital">List Your Hospital</Link>
          <Link to="/register?role=clinic">List Your Clinic</Link>
          <Link to="/register?role=medical">Medical Provider</Link>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} Hospital Marketplace. All rights reserved.</span>
        <span>Find Trusted Healthcare. Choose With Confidence.</span>
      </div>
    </footer>
  );
}
