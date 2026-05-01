import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { RoleGuard } from "./components/RoleGuard";
import { LoginPage } from "./pages/Auth/Login";
import { SignupPage } from "./pages/Auth/Signup";
import { CustomerDashboardPage } from "./pages/Customer/Dashboard";
import { LandingPage } from "./pages/Customer/Landing";
import { MyReservationsPage } from "./pages/Customer/MyReservations";
import { RestaurantDetailPage } from "./pages/Customer/RestaurantDetail";
import { RestaurantListPage } from "./pages/Customer/RestaurantList";
import { OwnerDashboardPage } from "./pages/Owner/Dashboard";
import MyRestaurants from "./pages/Owner/MyRestaurants";
import RestaurantForm from "./pages/Owner/RestaurantForm";
import OwnerReservationsList from "./pages/Owner/ReservationsList";
import OwnerReviewsList from "./pages/Owner/ReviewsList";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/restaurants" element={<RestaurantListPage />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <RoleGuard>
              <CustomerDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/reservations"
          element={
            <RoleGuard>
              <MyReservationsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/owner"
          element={
            <RoleGuard role="owner">
              <OwnerDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/owner/restaurants"
          element={
            <RoleGuard role="owner">
              <MyRestaurants />
            </RoleGuard>
          }
        />
        <Route
          path="/owner/restaurants/new"
          element={
            <RoleGuard role="owner">
              <RestaurantForm />
            </RoleGuard>
          }
        />
        <Route
          path="/owner/restaurants/:id/edit"
          element={
            <RoleGuard role="owner">
              <RestaurantForm />
            </RoleGuard>
          }
        />
        <Route
          path="/owner/restaurants/:id/reservations"
          element={
            <RoleGuard role="owner">
              <OwnerReservationsList />
            </RoleGuard>
          }
        />
        <Route
          path="/owner/restaurants/:id/reviews"
          element={
            <RoleGuard role="owner">
              <OwnerReviewsList />
            </RoleGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
