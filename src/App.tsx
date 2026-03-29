import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ProtectedRoute } from '@/components/RoleGuard';

// Pages
import Landing from '@/pages/Customer/Landing';
import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/Signup';
import RestaurantList from '@/pages/Customer/RestaurantList';
import RestaurantDetail from '@/pages/Customer/RestaurantDetail';
import CustomerDashboard from '@/pages/Customer/Dashboard';
import CustomerReservations from '@/pages/Customer/MyReservations';
import OwnerDashboard from '@/pages/Owner/Dashboard';
import OwnerRestaurants from '@/pages/Owner/MyRestaurants';
import OwnerRestaurantForm from '@/pages/Owner/RestaurantForm';
import OwnerReservationsList from '@/pages/Owner/ReservationsList';
import OwnerReviewsList from '@/pages/Owner/ReviewsList';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/reservations" element={<CustomerReservations />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/restaurants" element={<OwnerRestaurants />} />
          <Route path="/owner/restaurants/new" element={<OwnerRestaurantForm />} />
          <Route path="/owner/restaurants/:id/edit" element={<OwnerRestaurantForm />} />
          <Route path="/owner/restaurants/:id/reservations" element={<OwnerReservationsList />} />
          <Route path="/owner/restaurants/:id/reviews" element={<OwnerReviewsList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
