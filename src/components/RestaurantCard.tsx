import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Star } from 'lucide-react';
import { Restaurant } from '../lib/supabase';

interface RestaurantCardProps {
  restaurant: Restaurant;
  avgRating?: number;
  reviewCount?: number;
}

export function RestaurantCard({ restaurant, avgRating = 0, reviewCount = 0 }: RestaurantCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow border-border/50">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {restaurant.image_url ? (
          <img 
            src={restaurant.image_url} 
            alt={restaurant.name} 
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            No Image Provided
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className="bg-background text-foreground hover:bg-background/90 font-semibold shadow-sm">
            <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
            {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
            <span className="text-muted-foreground font-normal ml-1">({reviewCount})</span>
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-xl line-clamp-1">{restaurant.name}</h3>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        <Badge variant="secondary" className="mt-2 text-primary bg-primary/10 hover:bg-primary/20">
          {restaurant.cuisine_type}
        </Badge>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {restaurant.description || 'Welcome to our restaurant!'}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full font-semibold" asChild>
          <Link to={`/restaurants/${restaurant.restaurant_id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
