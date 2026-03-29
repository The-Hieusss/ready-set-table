import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, Restaurant, Review } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { MapPin, Phone, Clock, Star, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reservation state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('19:00');
  const [partySize, setPartySize] = useState<string>('2');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const { data: resData, error: resError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('restaurant_id', id)
          .single();
          
        if (resError) throw resError;
        setRestaurant(resData);
        
        const { data: revData, error: revError } = await supabase
          .from('reviews')
          .select(`
            *,
            users (name)
          `)
          .eq('restaurant_id', id)
          .order('review_date', { ascending: false });
          
        if (!revError && revData) {
          setReviews(revData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [id]);

  const handleReserve = async () => {
    if (!user) {
      toast('Please log in to make a reservation');
      navigate('/login');
      return;
    }
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setBooking(true);
    try {
      const { error } = await supabase.from('reservations').insert({
        user_id: user.user_id,
        restaurant_id: id,
        reservation_date: format(date, 'yyyy-MM-dd'),
        reservation_time: time,
        party_size: parseInt(partySize),
        status: 'upcoming'
      });

      if (error) throw error;
      
      toast.success('Reservation confirmed!');
      navigate('/customer/reservations');
    } catch (e: any) {
      toast.error(e.message || 'Failed making reservation');
    } finally {
      setBooking(false);
    }
  };

  const avgRating = reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!restaurant) {
    return <div className="text-center py-20 text-muted-foreground">Restaurant not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
             {restaurant.image_url ? (
              <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
            )}
             <div className="absolute top-4 right-4 bg-background/90 px-3 py-1.5 rounded-full flex items-center shadow-lg font-bold">
               <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
               {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
             </div>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{restaurant.name}</h1>
                <p className="text-lg text-primary font-medium mt-1">{restaurant.cuisine_type} Cuisine</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground">
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> {restaurant.address}</div>
              {restaurant.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-2"/> {restaurant.phone}</div>}
              {restaurant.opening_hours && <div className="flex items-center"><Clock className="w-4 h-4 mr-2"/> {restaurant.opening_hours}</div>}
            </div>

            <p className="mt-6 text-foreground/80 leading-relaxed text-lg">
              {restaurant.description || 'Enjoy a wonderful dining experience with us. Authentic flavors, great atmosphere, and excellent service.'}
            </p>
          </div>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-4 mt-4">
               {reviews.length === 0 ? (
                 <p className="text-muted-foreground py-4 italic">No reviews yet. Be the first to review!</p>
               ) : (
                 reviews.map((review) => (
                   <Card key={review.review_id} className="border-border/50">
                     <CardHeader className="pb-2">
                       <div className="flex justify-between items-start">
                         <CardTitle className="text-base">{(review as any).users?.name || 'Anonymous'}</CardTitle>
                         <div className="flex">
                           {Array(5).fill(0).map((_, i) => (
                             <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                           ))}
                         </div>
                       </div>
                       <CardDescription>{new Date(review.review_date).toLocaleDateString()}</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <p className="text-sm">{review.comment}</p>
                     </CardContent>
                   </Card>
                 ))
               )}
            </TabsContent>
            <TabsContent value="menu">
              <p className="text-muted-foreground py-4">Menu integration coming soon.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Reservation Form */}
        <div>
          <Card className="sticky top-24 shadow-xl border-primary/20 border-2">
            <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
              <CardTitle>Make a Reservation</CardTitle>
              <CardDescription>Book your table directly online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-muted-foreground/30">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="border-muted-foreground/30">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      {['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t =>(
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Party Size</label>
                  <Select value={partySize} onValueChange={setPartySize}>
                    <SelectTrigger className="border-muted-foreground/30">
                      <SelectValue placeholder="People" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      {[1,2,3,4,5,6,7,8,9,10].map(s =>(
                        <SelectItem key={s} value={s.toString()}>{s} People</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full py-6 text-lg font-bold" 
                onClick={handleReserve}
                disabled={booking}
              >
                {booking ? 'Confirming...' : 'Reserve Table'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
