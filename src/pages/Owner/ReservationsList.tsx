import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Reservation } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type ReservationWithUser = Reservation & { users: { name: string, email: string } };

export default function OwnerReservationsList() {
  const { id } = useParams<{ id: string }>();
  const [reservations, setReservations] = useState<ReservationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');

  const fetchReservations = async () => {
    try {
      // Get restaurant name
      const { data: restData } = await supabase
        .from('restaurants')
        .select('name')
        .eq('restaurant_id', id)
        .single();
        
      if (restData) setRestaurantName(restData.name);

      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          users ( name, email )
        `)
        .eq('restaurant_id', id)
        .order('reservation_date', { ascending: false });
        
      if (error) throw error;
      setReservations(data as unknown as ReservationWithUser[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [id]);

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
                  <TableRow key={res.reservation_id}>
                    <TableCell className="font-semibold">
                      {res.users?.name || 'Unknown'}
                      <div className="text-sm font-normal text-muted-foreground">{res.users?.email}</div>
                    </TableCell>
                    <TableCell>{format(parseISO(res.reservation_date), 'MMM d, yyyy')}</TableCell>
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
