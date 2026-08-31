import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import RequireRole from "./components/RequireRole";

import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import Doctors from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
import Clinics from "./pages/Clinics";
import Services from "./pages/Services";
import Treatments from "./pages/Treatments";
import Cities from "./pages/Cities";
import CityDetails from "./pages/CityDetails";
import Compare from "./pages/Compare";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import HospitalDashboard from "./pages/dashboard/HospitalDashboard";
import ClinicDashboard from "./pages/dashboard/ClinicDashboard";
import MedicalDashboard from "./pages/dashboard/MedicalDashboard";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <FavoritesProvider>
          <CompareProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/hospitals" element={<Hospitals />} />
                  <Route path="/hospitals/:id" element={<HospitalDetails />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/doctors/:id" element={<DoctorDetails />} />
                  <Route path="/clinics" element={<Clinics />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/treatments" element={<Treatments />} />
                  <Route path="/cities" element={<Cities />} />
                  <Route path="/cities/:id" element={<CityDetails />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  <Route path="/dashboard/hospital" element={<RequireRole role="hospital"><HospitalDashboard /></RequireRole>} />
                  <Route path="/dashboard/clinic" element={<RequireRole role="clinic"><ClinicDashboard /></RequireRole>} />
                  <Route path="/dashboard/medical" element={<RequireRole role="medical"><MedicalDashboard /></RequireRole>} />
                  <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CompareProvider>
        </FavoritesProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
