import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Reservation, Restaurant } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Calendar, Users, Clock, Loader2, Store } from 'lucide-react';
import { format, isAfter, isPast, parseISO } from 'date-fns';
import { toast } from 'sonner';

type ReservationWithRestaurant = Reservation & { restaurants: Restaurant };

export default function MyReservations() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'upcoming';
  
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState<ReservationWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          restaurants (*)
        `)
        .eq('user_id', user.user_id)
        .order('reservation_date', { ascending: true });

      if (error) throw error;
      setReservations(data as ReservationWithRestaurant[]);
    } catch (error: any) {
      toast.error('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('reservation_id', id);

      if (error) throw error;
      toast.success('Reservation cancelled');
      fetchReservations();
    } catch (e) {
      toast.error('Could not cancel reservation');
    }
  };

  const today = new Date();
  
  const upcoming = reservations.filter(r => 
    r.status !== 'cancelled' && isAfter(parseISO(`${r.reservation_date}T${r.reservation_time}`), today)
  );
  
  const past = reservations.filter(r => 
    r.status !== 'cancelled' && isPast(parseISO(`${r.reservation_date}T${r.reservation_time}`))
  );

  const cancelled = reservations.filter(r => r.status === 'cancelled');

  const getStatusBadge = (res: ReservationWithRestaurant) => {
    if (res.status === 'cancelled') return <Badge variant="destructive">Cancelled</Badge>;
    if (isPast(parseISO(`${res.reservation_date}T${res.reservation_time}`))) return <Badge variant="secondary">Completed</Badge>;
    return <Badge className="bg-primary hover:bg-primary/90">Upcoming</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const renderReservationCard = (res: ReservationWithRestaurant, isUpcoming: boolean) => (
    <Card key={res.reservation_id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusBadge(res)}
              <h3 className="text-xl font-bold flex items-center">
                <Store className="w-5 h-5 mr-2 text-muted-foreground" />
                {res.restaurants.name}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {format(parseISO(res.reservation_date), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {res.reservation_time}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {res.party_size} People
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[140px]">
            {isUpcoming && <Button variant="destructive" onClick={() => handleCancel(res.reservation_id)}>Cancel</Button>}
            {!isUpcoming && res.status !== 'cancelled' && (
               <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-foreground">Leave Review</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Reservations</h1>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground italic">No upcoming reservations.</p>
          ) : upcoming.map(res => renderReservationCard(res, true))}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {past.length === 0 ? (
            <p className="text-muted-foreground italic">No past reservations.</p>
          ) : past.map(res => renderReservationCard(res, false))}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          {cancelled.length === 0 ? (
            <p className="text-muted-foreground italic">No cancelled reservations.</p>
          ) : cancelled.map(res => renderReservationCard(res, false))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
