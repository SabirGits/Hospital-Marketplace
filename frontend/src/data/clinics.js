import { cities } from "./cities";

const clinicNames = [
  "CarePlus Family Clinic", "SmileCare Dental Clinic", "SkinLuxe Derma Clinic", "MediFirst Walk-in Clinic",
  "Wellness Point Clinic", "OrthoFit Clinic", "Little Steps Pediatric Clinic", "EyeCare Vision Clinic",
  "HeartBeat Cardiac Clinic", "NeuroCare Clinic", "Mother's Touch Maternity Clinic", "QuickCare Diagnostics Clinic",
  "Serenity Mental Wellness Clinic", "ENT Plus Clinic", "Physio Active Clinic", "Total Health Clinic",
];
const specialtyList = ["General Physician", "Dentistry", "Dermatology", "Multi-Specialty", "Orthopedics", "Pediatrics", "Ophthalmology", "Cardiology", "Neurology", "Gynecology", "Diagnostics", "Mental Health", "ENT", "Physiotherapy"];

export const clinics = clinicNames.map((name, i) => {
  const city = cities[i % cities.length];
  return {
    id: `clinic-${i + 1}`,
    name,
    image: `https://images.unsplash.com/photo-${["1629909613654-28e377c37b09", "1629909615184-74f495363b67", "1587854692152-cbe660dbde88", "1666214280391-8ff5bd3c0bf0"][i % 4]}?w=800&q=80`,
    city: city.name,
    location: `${city.name} — Sector ${5 + (i % 20)}`,
    specialty: specialtyList[i % specialtyList.length],
    verified: i % 4 !== 0,
    rating: +(3.7 + ((i * 23) % 12) / 10).toFixed(1),
    reviews: 10 + ((i * 31) % 200),
    services: ["Consultation", "Diagnostics", "Minor Procedures"].slice(0, 1 + (i % 3)),
    hours: i % 3 === 0 ? "24 Hours" : "9:00 AM – 8:00 PM",
    phone: `+91 8${String(200000000 + i * 191).slice(0, 9)}`,
  };
});

export const getClinicById = (id) => clinics.find((c) => c.id === id);
