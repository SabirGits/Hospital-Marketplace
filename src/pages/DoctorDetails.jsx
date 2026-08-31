import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, IndianRupee, Languages, Phone, Heart, CalendarCheck, MessageCircle } from "lucide-react";
import { getDoctorById } from "../data/doctors";
import Rating from "../components/Rating";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import ImageWithFallback from "../components/ImageWithFallback";
import BookingModal from "../components/BookingModal";
import ChatModal from "../components/ChatModal";
import { useFavorites } from "../context/FavoritesContext";

export default function DoctorDetails() {
  const { id } = useParams();
  const doctor = getDoctorById(id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (!doctor) {
    return <div className="container section"><EmptyState type="search" title="Doctor not found" message="This profile may have been removed." actionLabel="Browse Doctors" onAction={() => (window.location.href = "/doctors")} /></div>;
  }

  const favored = isFavorite(doctor.id, "doctor");

  return (
    <div className="container section">
      <div className="doctor-profile-card">
        <ImageWithFallback src={doctor.photo} alt={doctor.name} kind="doctor" />
        <div>
          <div className="flex-between">
            <h1>{doctor.name}</h1>
            {doctor.verified && <Badge variant="verified" />}
          </div>
          <p className="text-muted">{doctor.specialty} · {doctor.qualification}</p>
          <p className="text-muted"><Building2 size={14} /> <Link to={`/hospitals/${doctor.hospitalId}`}>{doctor.hospital}</Link></p>
          <div className="flex gap-16 mt-8" style={{ alignItems: "center" }}>
            <Rating value={doctor.rating} count={doctor.reviews} size="lg" />
            <span className="fee"><IndianRupee size={14} /> {doctor.fee} consultation</span>
          </div>
          <p className="text-muted mt-8"><Languages size={14} /> {doctor.languages.join(", ")}</p>
          <p className="mt-16">{doctor.bio}</p>
          <div className="flex gap-12 mt-24" style={{ flexWrap: "wrap" }}>
            <Badge variant={doctor.available ? "open" : "closed"}>{doctor.available ? "Available Today" : "Fully Booked"}</Badge>
            <button className="btn btn-primary btn-sm" onClick={() => setBookingOpen(true)}><CalendarCheck size={14} /> Book Appointment</button>
            <button className="btn btn-outline btn-sm" onClick={() => setChatOpen(true)}><MessageCircle size={14} /> Chat with Doctor</button>
            <a href="tel:+911234567890" className="btn btn-outline btn-sm"><Phone size={14} /> Call Clinic</a>
            <button className={`btn btn-sm ${favored ? "btn-accent" : "btn-primary"}`} onClick={() => toggleFavorite({ id: doctor.id, type: "doctor", name: doctor.name })}>
              <Heart size={14} fill={favored ? "currentColor" : "none"} /> {favored ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} doctor={doctor} />
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} doctor={doctor} />
    </div>
  );
}
