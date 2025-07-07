import { Route, Routes, Navigate } from "react-router-dom";
import { RoutePaths } from "./RoutePaths.jsx";
import { Home } from "../home/Home.jsx";
import { NotFound } from "./NotFound.jsx";
import { Layout } from "./Layout.jsx";
import LoginPage from "../pages/Login/Login.jsx";
import RegistrationPage from "../pages/Register/Register.jsx";
import EventDetails from "../components/Cards/EventCards/EventDetails.jsx";
import TicketBooking from "../components/TicketBooking/TicketBooking.jsx";
import SuccessPage from "../pages/SuccessPage.jsx";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import CreateEvent from "../components/admin/CreateEvent.jsx";
import MyBookings from "../components/bookings/MyBookings.jsx";
import PrivateRoute from "../general/PrivateRoute"; // 🔐 Import this

export const AppRouter = () => (
  <Routes>
    {/* Optional: protect home page if needed */}
    <Route
      path={RoutePaths.HOME}
      element={
        <PrivateRoute>
          <Layout><Home /></Layout>
        </PrivateRoute>
      }
    />


    <Route path={RoutePaths.LOGIN} element={<Layout><LoginPage /></Layout>} />
    <Route path={RoutePaths.REGISTER} element={<Layout><RegistrationPage /></Layout>} />
    <Route path={RoutePaths.EVENT_DETAILS} element={<Layout><EventDetails /></Layout>} />
    <Route path={RoutePaths.BOOK_TICKETS} element={<Layout><TicketBooking /></Layout>} />
    <Route path={RoutePaths.SUCCESS} element={<Layout><SuccessPage /></Layout>} />

    {/* 🔐 Protected Routes */}
    <Route
      path={RoutePaths.ADMIN}
      element={
        <PrivateRoute>
          <Layout><AdminDashboard /></Layout>
        </PrivateRoute>
      }
    />
    <Route
      path={RoutePaths.CREATE}
      element={
        <PrivateRoute>
          <Layout><CreateEvent /></Layout>
        </PrivateRoute>
      }
    />
    <Route
      path={RoutePaths.MY_BOOKINGS}
      element={
        <PrivateRoute>
          <Layout><MyBookings /></Layout>
        </PrivateRoute>
      }
    />

    {/* Not Found fallback */}
    <Route path="*" element={<Layout><NotFound /></Layout>} />
  </Routes>
);
