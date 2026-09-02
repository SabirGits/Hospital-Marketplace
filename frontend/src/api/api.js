import axios from "axios";
import { normalizeHospital, normalizeHospitalList, normalizeClinic, normalizeClinicList, normalizeDoctor, normalizeDoctorList } from "./adapters";

// Points at your Express server. Set VITE_API_BASE_URL in .env to override
// (see .env.example). Falls back to localhost:5000 for local dev.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// Rewrite axios errors so `err.message` is always the backend's actual
// message ("Your registration is still pending admin approval.") instead of
// axios's generic "Request failed with status code 403" — every catch
// block in the app just does `showToast(err.message)` and expects that.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error?.response?.data?.message;
    if (backendMessage) error.message = backendMessage;
    return Promise.reject(error);
  }
);

// Attach the JWT (once logged in) to every request automatically.
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Frontend role labels <-> backend enum ("Hospital" | "Medical" | "Clinic")
const ROLE_TO_BACKEND = { hospital: "Hospital", medical: "Medical", clinic: "Clinic" };
const ROLE_FROM_BACKEND = { Hospital: "hospital", Medical: "medical", Clinic: "clinic" };

function mapUserOut(user) {
  return { ...user, role: ROLE_FROM_BACKEND[user.role] || user.role };
}

/* ============================================================
   HOSPITALS
   ============================================================ */

export async function getHospitals(params = {}) {
  const path = params.city ? `/hospitals/city/${encodeURIComponent(params.city)}` : "/hospitals/all";
  const { data } = await apiClient.get(path);
  return normalizeHospitalList(data.hospitals);
}

export async function getHospitalById(id) {
  const { data } = await apiClient.get(`/hospitals/${id}`);
  return normalizeHospital(data.hospital);
}

/* ============================================================
   AUTH — hospital / clinic / medical accounts
   ============================================================ */

export async function registerUser(payload) {
  const backendRole = ROLE_TO_BACKEND[payload.role];
  if (!backendRole) {
    throw new Error(`Registration for "${payload.role}" isn't supported.`);
  }

  const body = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    location: payload.location || payload.city,
    phone: payload.phone,
    website: payload.website || "",
    socialMedia: payload.social || "",
    role: backendRole,
    plan: payload.plan || "basic",
    image: payload.image || "",
    hospitalName: payload.hospitalName || "",
    hospitalType: payload.hospitalType || "",
    address: payload.address || "",
    city: payload.city || payload.location || "",
    mapLink: payload.mapLink || "",
    specialties: payload.specialties || "",
    emergency: !!payload.emergency,
    description: payload.description || "",
    clinicName: payload.clinicName || "",
    businessName: payload.businessName || "",
    medicalType: payload.medicalType || "",
    services: payload.services || "",
  };

  const { data } = await apiClient.post("/auth/register", body);
  return { success: true, message: data.message, user: data.user };
}

export async function loginUser({ email, password }) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return { token: data.token, user: mapUserOut(data.user) };
}

export async function adminLogin({ email, password }) {
  const { data } = await apiClient.post("/admin/login", { email, password });
  setAuthToken(data.token);
  return { token: data.token, user: { ...data.admin, role: "admin" } };
}

// The Google button hands us the raw signed credential (JWT string) — the
// backend verifies it against Google, we never trust it unchecked here.
export async function loginWithGoogle(credential) {
  const { data } = await apiClient.post("/auth/google", { credential });
  setAuthToken(data.token);
  return { token: data.token, user: mapUserOut(data.user) };
}

export async function patientLogin({ name, email }) {
  const { data } = await apiClient.post("/auth/patient-login", { name, email });
  setAuthToken(data.token);
  return { token: data.token, user: data.user };
}

export async function requestPasswordReset(email) {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data; // { message, demoCode } — no email service wired up server-side yet
}

export async function verifyResetCode(email, code) {
  const { data } = await apiClient.post("/auth/verify-reset-code", { email, code });
  return data;
}

export async function resetPassword(email, code, newPassword) {
  const { data } = await apiClient.post("/auth/reset-password", { email, code, newPassword });
  return data;
}

/* ============================================================
   ADMIN — provider registration review
   ============================================================ */

export async function getProviderRequests() {
  const { data } = await apiClient.get("/admin/requests");
  return data.requests.map((r) => ({ ...r, id: r._id, submittedAt: r.createdAt, role: ROLE_FROM_BACKEND[r.role] || r.role }));
}

export async function approveProviderRequest(id) {
  const { data } = await apiClient.post(`/admin/requests/${id}/approve`);
  return data;
}

// Deletes the request outright — nothing left unapproved sticks around.
export async function rejectProviderRequest(id) {
  const { data } = await apiClient.post(`/admin/requests/${id}/reject`);
  return data;
}

// Separate from reject: removes a record regardless of its status, so an
// already-approved listing can still be taken down later if needed.
export async function deleteProviderRequest(id) {
  const { data } = await apiClient.delete(`/admin/requests/${id}`);
  return data;
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */

export async function getNotifications(recipient) {
  const { data } = await apiClient.get(`/notifications/${encodeURIComponent(recipient)}`);
  return data.notifications;
}

export async function deleteNotification(id) {
  await apiClient.delete(`/notifications/${id}`);
}

export async function clearNotifications(recipient) {
  await apiClient.delete(`/notifications/clear/${encodeURIComponent(recipient)}`);
}

/* ============================================================
   CLINICS — real backend (mirrors the hospital endpoints)
   ============================================================ */

export async function getClinics(params = {}) {
  const path = params.city ? `/clinics/city/${encodeURIComponent(params.city)}` : "/clinics/all";
  const { data } = await apiClient.get(path);
  return normalizeClinicList(data.providers);
}

export async function getClinicById(id) {
  const { data } = await apiClient.get(`/clinics/${id}`);
  return normalizeClinic(data.provider);
}

/* ============================================================
   DOCTORS — real backend. Hospitals add/edit/remove their own doctors
   from the dashboard; everyone can browse and rate.
   ============================================================ */

export async function getDoctors(params = {}) {
  const { data } = await apiClient.get("/doctors/all");
  let results = normalizeDoctorList(data.doctors);
  if (params.city) results = results.filter((d) => d.city === params.city);
  if (params.specialty) results = results.filter((d) => d.specialty === params.specialty);
  return results;
}

export async function getDoctorById(id) {
  const { data } = await apiClient.get(`/doctors/${id}`);
  return normalizeDoctor(data.doctor);
}

export async function getDoctorsByHospital(hospitalId) {
  const { data } = await apiClient.get(`/doctors/hospital/${hospitalId}`);
  return normalizeDoctorList(data.doctors);
}

export async function createDoctor(fields) {
  const { data } = await apiClient.post("/doctors", fields);
  return normalizeDoctor(data.doctor);
}

export async function updateDoctor(id, fields) {
  const { data } = await apiClient.put(`/doctors/${id}`, fields);
  return normalizeDoctor(data.doctor);
}

export async function deleteDoctor(id) {
  await apiClient.delete(`/doctors/${id}`);
}

/* ============================================================
   RATINGS — anyone can leave a 1-5 star rating on a hospital, clinic or doctor
   ============================================================ */

export async function rateHospital(id, rating) {
  const { data } = await apiClient.post(`/hospitals/${id}/rate`, { rating });
  return normalizeHospital(data.provider);
}

export async function rateClinic(id, rating) {
  const { data } = await apiClient.post(`/clinics/${id}/rate`, { rating });
  return normalizeClinic(data.provider);
}

export async function rateDoctor(id, rating) {
  const { data } = await apiClient.post(`/doctors/${id}/rate`, { rating });
  return normalizeDoctor(data.doctor);
}

export async function submitContactForm(payload) {
  await delay(400);
  return { success: true, message: "Your message has been sent." };
}

/* ============================================================
   PROVIDER'S OWN PROFILE — for the Hospital/Clinic/Medical dashboards
   ============================================================ */

export async function getMyProfile() {
  const { data } = await apiClient.get("/auth/me");
  return data.user;
}

export async function updateMyProfile(fields) {
  const { data } = await apiClient.put("/auth/me", fields);
  return data.user;
}

/* ============================================================
   ADMIN — editing provider records, and the admin's own profile
   ============================================================ */

export async function updateProviderRequest(id, fields) {
  const { data } = await apiClient.put(`/admin/requests/${id}`, fields);
  return data.user;
}

export async function getAdminProfile() {
  const { data } = await apiClient.get("/admin/profile");
  return data.admin;
}

export async function updateAdminProfile(fields) {
  const { data } = await apiClient.put("/admin/profile", fields);
  return data.admin;
}
