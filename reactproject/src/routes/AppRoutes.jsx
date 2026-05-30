import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Frontend Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Trips from '../pages/Trips/Trips';
import TripDetails from '../pages/TripDetails/TripDetails';
import Blog from '../pages/Blog/Blog';
import Contact from '../pages/Contact/Contact';

// Admin Dashboard Pages
import TripsAdmin from '../pages/AdminDashboard/TripsAdmin/TripsAdmin';
import CreateTrip from '../pages/AdminDashboard/TripsAdmin/CreateTrip';
import EditTrip from '../pages/AdminDashboard/TripsAdmin/EditTrip';
import TripTypesAdmin from '../pages/AdminDashboard/TripTypesAdmin/TripTypesAdmin';
import BlogsAdmin from '../pages/AdminDashboard/BlogsAdmin/BlogsAdmin';
import BookingsAdmin from '../pages/AdminDashboard/BookingsAdmin/BookingsAdmin';
import SettingsAdmin from '../pages/AdminDashboard/SettingsAdmin/SettingsAdmin';
import QuestionsAdmin from '../pages/AdminDashboard/QuestionsAdmin/QuestionsAdmin';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Front-End Pages (Main Layout with Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Pages (Auth Layout without Navbar & Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Dashboard Pages (Dashboard Layout) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="trips" element={<TripsAdmin />} />
        <Route path="trips/create" element={<CreateTrip />} />
        <Route path="trips/edit/:id" element={<EditTrip />} />
        <Route path="trip-types" element={<TripTypesAdmin />} />
        <Route path="blogs" element={<BlogsAdmin />} />
        <Route path="bookings" element={<BookingsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="questions" element={<QuestionsAdmin />} />
        <Route path="admindashboard" element={<AdminDashboard />} />


      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
