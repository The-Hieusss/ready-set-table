import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Restaurant } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Store, Plus, Settings, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function MyRestaurants() {
  const { user } = useAuthStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_id', user.user_id)
          .order('name');
        
        if (error) throw error;
        setRestaurants(data || []);
      } catch (err) {
        toast.error('Could not load restaurants');
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Restaurants</h1>
          <p className="text-muted-foreground mt-2">Manage your restaurant listings</p>
        </div>
        <Button asChild className="bg-primary">
          <Link to="/owner/restaurants/new"><Plus className="mr-2 h-4 w-4" /> Add Restaurant</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : restaurants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16">
                    <Store className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-foreground">No restaurants yet</p>
                    <p className="text-muted-foreground mb-4">You haven't added any restaurants to your portfolio.</p>
                    <Button asChild variant="outline">
                      <Link to="/owner/restaurants/new">List your first restaurant</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                restaurants.map(rest => (
                  <TableRow key={rest.restaurant_id} className="cursor-pointer group hover:bg-muted/50">
                    <TableCell className="font-semibold text-lg">{rest.name}</TableCell>
                    <TableCell className="text-muted-foreground">{rest.address}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary text-primary">{rest.cuisine_type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/owner/restaurants/${rest.restaurant_id}/reservations`} title="Reservations">
                            <Calendar className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/owner/restaurants/${rest.restaurant_id}/reviews`} title="Reviews">
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/owner/restaurants/${rest.restaurant_id}/edit`} title="Edit">
                            <Settings className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
