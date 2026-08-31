import { useMemo, useState } from "react";
import Modal from "./Modal";
import { useToast } from "../context/ToastContext";
import { WEEKDAYS } from "../data/doctors";

function nextDays(n = 6) {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

// Fallback slots for doctors that don't have a set weekly schedule yet.
const FALLBACK_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];

export default function BookingModal({ open, onClose, doctor }) {
  const days = useMemo(() => nextDays(), []);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const { showToast } = useToast();

  const selectedDay = days[dayIndex];
  const weekday = WEEKDAYS[selectedDay.getDay()];
  const scheduledTime = doctor?.schedule?.[weekday];
  const hasSchedule = !!doctor?.schedule;

  // Fallback "availability" for doctors without a schedule — deterministic
  // so it doesn't jump around on re-render.
  const fallbackTaken = useMemo(() => {
    const seed = (dayIndex + 1) * (doctor?.id?.length || 3);
    return FALLBACK_SLOTS.filter((_, i) => (seed + i) % 4 === 0);
  }, [dayIndex, doctor]);

  const close = () => { onClose(); setTimeout(() => { setConfirmed(false); setSlot(null); setDayIndex(0); }, 200); };

  const confirm = () => {
    setConfirmed(true);
    showToast(`Appointment requested with ${doctor?.name} — ${selectedDay.toDateString()}, ${slot}`);
  };

  if (!doctor) return null;

  return (
    <Modal open={open} onClose={close} title={confirmed ? "Appointment Requested" : `Book ${doctor.name}`}>
      {!confirmed ? (
        <>
          <p className="text-muted mb-16">
            {hasSchedule ? "This doctor's sitting time can change day to day — pick a day to see it." : "Select a day and time — demo booking flow."}
          </p>
          <div className="booking-day-row">
            {days.map((d, i) => (
              <button key={i} className={`booking-day ${dayIndex === i ? "active" : ""}`} onClick={() => { setDayIndex(i); setSlot(null); }}>
                <span>{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                <strong>{d.getDate()}</strong>
              </button>
            ))}
          </div>

          {hasSchedule ? (
            <div className="mt-16">
              {scheduledTime ? (
                <button className={`booking-slot booking-slot-single ${slot === scheduledTime ? "active" : ""}`} onClick={() => setSlot(scheduledTime)}>
                  Sitting at {scheduledTime} on {weekday}
                </button>
              ) : (
                <p className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>Not available on {weekday}. Try another day.</p>
              )}
            </div>
          ) : (
            <div className="booking-slot-grid mt-16">
              {FALLBACK_SLOTS.map((s) => {
                const taken = fallbackTaken.includes(s);
                return (
                  <button key={s} className={`booking-slot ${slot === s ? "active" : ""} ${taken ? "taken" : ""}`} disabled={taken} onClick={() => setSlot(s)}>
                    {s}
                  </button>
                );
              })}
            </div>
          )}

          <button className="btn btn-primary btn-block mt-24" disabled={!slot} onClick={confirm}>
            {slot ? `Confirm ${slot} on ${selectedDay.toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : "Select a time"}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <p>Your appointment request has been sent. {doctor.name}'s office will confirm shortly.</p>
          <button className="btn btn-outline btn-block mt-24" onClick={close}>Done</button>
        </div>
      )}
    </Modal>
  );
}
