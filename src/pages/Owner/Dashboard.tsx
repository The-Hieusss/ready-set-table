import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Store, Calendar, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ restaurants: 0, reservations: 0, reviews: 0 });

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      
      const [restRes, revRes] = await Promise.all([
        supabase.from('restaurants').select('restaurant_id', { count: 'exact' }).eq('owner_id', user.user_id),
        // Simplified metrics for MVP
        supabase.from('reviews').select('review_id', { count: 'exact' }).eq('user_id', user.user_id) 
      ]);

      setStats({
        restaurants: restRes.count || 0,
        reservations: 0, // Would require JOIN through restaurants
        reviews: revRes.count || 0
      });
    }
    loadStats();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Owner Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your restaurants and track performance.</p>
        </div>
        <Button asChild className="bg-primary hidden sm:flex">
          <Link to="/owner/restaurants/new">List New Restaurant</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.restaurants}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews}</div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Party Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-muted">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Connect specific restaurants to see activity here.</p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-muted">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/owner/restaurants"><Store className="mr-2 h-4 w-4" /> Manage Restaurants</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/owner/restaurants/new"><Calendar className="mr-2 h-4 w-4" /> Add Restaurant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
