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
    image: FALLBACK_IMAGE,
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
