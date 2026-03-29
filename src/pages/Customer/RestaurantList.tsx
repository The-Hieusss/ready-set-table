import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Restaurant } from '../../lib/supabase';
import { RestaurantCard } from '../../components/RestaurantCard';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Loader2, Search } from 'lucide-react';

export default function RestaurantList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [restaurants, setRestaurants] = useState<(Restaurant & { avg_rating?: number, review_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase.from('restaurants').select(`
        *,
        reviews ( rating )
      `);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,cuisine_type.ilike.%${searchQuery}%`);
      }

      if (cuisineFilter !== 'all') {
        query = query.eq('cuisine_type', cuisineFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Calculate avg ratings manually since Supabase doesn't support aggregate functions easily in JS client without RPC
      let processed = data.map(r => {
        const reviews = r.reviews as {rating: number}[] || [];
        const avg = reviews.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
        return { ...r, avg_rating: avg, review_count: reviews.length };
      });

      if (ratingFilter !== 'all') {
        const minRating = Number(ratingFilter);
        processed = processed.filter(r => (r.avg_rating || 0) >= minRating);
      }

      setRestaurants(processed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [cuisineFilter, ratingFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) newParams.set('q', searchQuery);
    else newParams.delete('q');
    setSearchParams(newParams);
    fetchRestaurants();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Find Restaurants</h1>
          <p className="text-muted-foreground mt-2">Discover and book the best tables in town.</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or address..." 
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger className="w-full md:w-[160px] h-11">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-[140px] h-11">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="h-11 px-8 hidden md:flex">Search</Button>
          </div>
          <Button type="submit" className="h-11 w-full md:hidden">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/50">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No restaurants found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setCuisineFilter('all');
              setRatingFilter('all');
              setSearchParams({});
              // fetchRestaurants will hook on next render due to effect dependencies, but we should call it manually for input
              setTimeout(fetchRestaurants, 0);
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map(rest => (
            <RestaurantCard 
              key={rest.restaurant_id} 
              restaurant={rest} 
              avgRating={rest.avg_rating} 
              reviewCount={rest.review_count} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Simple icon for empty state
function UtensilsCrossed(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m8.5 8.5 5 5" />
      <path d="m14 14 7-7" />
    </svg>
  );
}
