import { Route, Routes } from "react-router-dom";
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import ServiceDetail from "../pages/public/ServiceDetail";
import About from "../pages/public/About";
import Gallery from "../pages/public/Gallery";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserLayout from "../components/layout/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Dashboard from "../pages/user/Dashboard";
import BookAppointment from "../pages/public/BookAppointment";
import MyAppointments from "../pages/user/MyAppointments";
import Profile from "../pages/user/Profile";

import AdminLayout from "../components/layout/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAppointments from "../pages/admin/Appointments";
import AdminCategory from "../pages/admin/AdminCategory";
import Users from "../pages/admin/Users";
import Staff from "../pages/admin/Staff";
import AdminServices from "../pages/admin/Services";
import ServiceForm from "../pages/admin/ServiceForm";
import AdminGallery from "../pages/admin/AdminGallery";
import AdminFaq from "../pages/admin/AdminFaq";
import Settings from "../pages/admin/Settings";
import AdminReviews from "../pages/admin/AdminReviews";

import StaffLayout from "../components/layout/StaffLayout";
import StaffRoute from "./StaffRoute";

import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffAppointments from "../pages/staff/StaffAppointments";
import StaffCalendar from "../pages/staff/StaffCalendar";
import StaffProfile from "../pages/staff/StaffProfile";
import StaffReviews from "../pages/staff/StaffReviews";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/service/:slug" element={<ServiceDetail />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/categories" element={<AdminCategory />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/services/create" element={<ServiceForm />} />
          <Route path="/admin/services/edit/:slug" element={<ServiceForm />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/faq" element={<AdminFaq />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<StaffRoute />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/calendar" element={<StaffCalendar />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
          <Route path="/staff/reviews" element={<StaffReviews />} />
        </Route>
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
