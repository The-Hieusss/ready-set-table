import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Utensils } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-90 transition-opacity">
          <Utensils className="h-6 w-6" />
          <span>Ready Set Table</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          ) : (
            <>
              {user.role === 'customer' && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/restaurants">Browse</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/customer/reservations">My Reservations</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/customer/dashboard">Dashboard</Link>
                  </Button>
                </>
              )}
              {user.role === 'owner' && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/owner/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/owner/restaurants">My Restaurants</Link>
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
