import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Review } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2, Star, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type ReviewWithUser = Review & { users: { name: string, email: string } };

export default function OwnerReviewsList() {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState('');

  const fetchReviews = async () => {
    try {
      const { data: restData } = await supabase
        .from('restaurants')
        .select('name')
        .eq('restaurant_id', id)
        .single();
        
      if (restData) setRestaurantName(restData.name);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users ( name, email )
        `)
        .eq('restaurant_id', id)
        .order('review_date', { ascending: false });
        
      if (error) throw error;
      setReviews(data as unknown as ReviewWithUser[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const avgRating = reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/owner/restaurants"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Restaurants</Link>
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reviews</h1>
          <p className="text-muted-foreground mt-2">{restaurantName}</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center">
          <div className="flex items-center">
            <Star className="h-6 w-6 fill-accent text-accent mr-2" />
            <span className="text-2xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground">/5</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground mt-1">{reviews.length} total reviews</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center p-12 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-medium text-foreground">No Reviews Yet</h3>
              <p>Customers haven't reviewed this restaurant yet.</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map(rev => (
            <Card key={rev.review_id} className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{rev.users?.name || 'Anonymous Customer'}</CardTitle>
                    <CardDescription>{format(parseISO(rev.review_date), 'MMMM d, yyyy')}</CardDescription>
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < rev.rating ? 'fill-accent text-accent' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">{rev.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
