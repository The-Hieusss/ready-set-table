import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOwnerReservations, type Reservation } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function OwnerReservationsList() {
  const { id } = useParams<{ id: string }>();
  const { profile, accessToken } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');

  const fetchReservations = useCallback(async () => {
    if (!id || !profile || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await getOwnerReservations(id, profile.id, accessToken);
      setRestaurantName(data.restaurant.name);
      setReservations(data.reservations);
    } catch (err) {
      console.error(err);
      toast.error("Could not load reservations");
    } finally {
      setLoading(false);
    }
  }, [accessToken, id, profile]);

  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/owner/restaurants"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Restaurants</Link>
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-2">{restaurantName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-foreground">No reservations yet</p>
                    <p className="text-muted-foreground">Bookings will appear here once customers reserve.</p>
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map(res => (
                  <TableRow key={res.reservation_id ?? res.id}>
                    <TableCell className="font-semibold">
                      {res.customerName || res.customer_name || 'Unknown'}
                    </TableCell>
                    <TableCell>{res.reservation_date ? format(parseISO(res.reservation_date), 'MMM d, yyyy') : 'Unknown date'}</TableCell>
                    <TableCell>{res.reservation_time}</TableCell>
                    <TableCell>{res.party_size} People</TableCell>
                    <TableCell>
                      {res.status === 'cancelled' ? (
                        <Badge variant="destructive">Cancelled</Badge>
                      ) : (
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">Confirmed</Badge>
                      )}
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
