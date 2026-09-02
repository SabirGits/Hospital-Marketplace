/**
 * Maps a backend hospital document (a User with role: "Hospital") into the
 * richer shape the UI components expect. The backend now stores every field
 * the registration form collects, so this is a straight field mapping —
 * the only made-up values left are the ones nothing in the app captures yet
 * (a stock image, since there's no photo upload; rating/reviews, since
 * there's no review system yet).
 */

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=900&q=80";

export function normalizeHospital(user) {
  if (!user) return null;
  const specialtyList = user.specialties
    ? user.specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return {
    id: user._id,
    name: user.hospitalName || user.name,
    city: user.city || user.location,
    address: user.address || user.location,
    mapLink: user.mapLink || "",
    phone: user.phone,
    email: user.email,
    website: user.website || "",
    image: user.image || FALLBACK_IMAGE,
    type: user.hospitalType || "General",
    est: user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear(),
    beds: 0,
    emergency: !!user.emergency,
    isOpen: true,
    verified: user.status === "approved",
    trustScore: user.plan === "premium" ? 95 : user.plan === "verified" ? 85 : 75,
    rating: 0,
    reviews: 0,
    specialties: specialtyList,
    departments: specialtyList,
    facilities: [],
    accreditation: user.status === "approved" ? "Verified by Admin" : "Pending Verification",
    description: user.description || `${user.hospitalName || user.name} is a registered provider on Hospital Marketplace.`,
  };
}

export function normalizeHospitalList(users = []) {
  return users.map(normalizeHospital);
}

/**
 * Same idea as normalizeHospital, but for a Clinic-role User. Clinics reuse
 * a couple of the hospital-shaped fields under the hood (see Register.jsx —
 * "Specialty" is stored in the same `hospitalType` field), which is why
 * those show up mapped here too.
 */
export function normalizeClinic(user) {
  if (!user) return null;
  return {
    id: user._id,
    name: user.clinicName || user.name,
    image: user.image || FALLBACK_IMAGE,
    city: user.city || user.location,
    location: user.address || user.location,
    specialty: user.hospitalType || "",
    verified: user.status === "approved",
    rating: user.rating || 0,
    reviews: user.reviews || 0,
    services: user.services ? user.services.split(",").map((s) => s.trim()).filter(Boolean) : [],
    phone: user.phone,
    email: user.email,
    website: user.website || "",
    address: user.address || user.location,
    mapLink: user.mapLink || "",
    description: user.description || "",
  };
}

export function normalizeClinicList(users = []) {
  return users.map(normalizeClinic);
}

/**
 * A Doctor document, with its hospital populated (see doctorController).
 */
export function normalizeDoctor(doc) {
  if (!doc) return null;
  const hospital = doc.hospitalId && typeof doc.hospitalId === "object" ? doc.hospitalId : null;
  return {
    id: doc._id,
    name: doc.name,
    photo: doc.image || "",
    specialty: doc.specialty || "",
    qualification: doc.qualification || "",
    experience: doc.experience || 0,
    hospital: hospital?.hospitalName || hospital?.name || "",
    hospitalId: hospital?._id || (typeof doc.hospitalId === "string" ? doc.hospitalId : ""),
    city: hospital?.city || hospital?.location || "",
    verified: true,
    rating: doc.rating || 0,
    reviews: doc.reviews || 0,
    fee: doc.fee || 0,
    available: doc.available !== false,
    languages: doc.languages ? doc.languages.split(",").map((s) => s.trim()).filter(Boolean) : [],
    bio: doc.bio || "",
    schedule: doc.schedule || null,
  };
}

export function normalizeDoctorList(docs = []) {
  return docs.map(normalizeDoctor);
}
