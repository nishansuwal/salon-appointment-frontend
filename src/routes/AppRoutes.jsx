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

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAppointments from "../pages/admin/Appointments";
import Users from "../pages/admin/Users";
import AdminServices from "../pages/admin/Services";
import ServiceForm from "../pages/admin/ServiceForm";
import Settings from "../pages/admin/Settings";

import AdminLayout from "../components/layout/AdminLayout";

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
        {/* <Route element={<UserLayout />}> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/profile" element={<Profile />} />
        {/* </Route> */}
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/services/create" element={<ServiceForm />} />
          <Route path="/admin/services/edit/:slug" element={<ServiceForm />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
