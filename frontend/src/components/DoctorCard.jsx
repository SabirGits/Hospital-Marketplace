import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Stethoscope, Building2, IndianRupee, CalendarCheck, MessageCircle } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import Rating from "./Rating";
import Badge from "./Badge";
import BookingModal from "./BookingModal";
import ChatModal from "./ChatModal";
import { useFavorites } from "../context/FavoritesContext";

export default function DoctorCard({ doctor }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favored = isFavorite(doctor.id, "doctor");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="card card-hover doctor-card">
      <ImageWithFallback src={doctor.photo} alt={doctor.name} kind="doctor" className="dcard-photo" />
      <div className="dcard-top">
        <button
          className={`fav-btn fav-btn-inline ${favored ? "is-fav" : ""}`}
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite({ id: doctor.id, type: "doctor", name: doctor.name })}
        >
          <Heart size={15} fill={favored ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="dcard-body">
        <div className="flex-between">
          <h4 className="dcard-name">{doctor.name}</h4>
          {doctor.verified && <Badge variant="verified" />}
        </div>
        <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}><Stethoscope size={13} /> {doctor.specialty} · {doctor.qualification}</p>
        <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}><Building2 size={13} /> {doctor.hospital}</p>
        <div className="flex-between mt-8">
          <Rating value={doctor.rating} count={doctor.reviews} />
          <span className="fee"><IndianRupee size={12} />{doctor.fee}</span>
        </div>
        <div className="flex-between mt-16">
          <Badge variant={doctor.available ? "open" : "closed"}>{doctor.available ? "Available" : "Unavailable"}</Badge>
          <Link to={`/doctors/${doctor.id}`} className="btn btn-primary btn-sm">View Profile</Link>
        </div>
        <div className="hcard-actions">
          <button className="btn btn-outline btn-sm" onClick={() => setBookingOpen(true)}><CalendarCheck size={13} /> Book</button>
          <button className="btn btn-outline btn-sm" onClick={() => setChatOpen(true)}><MessageCircle size={13} /> Chat</button>
        </div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} doctor={doctor} />
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} doctor={doctor} />
    </div>
  );
}
