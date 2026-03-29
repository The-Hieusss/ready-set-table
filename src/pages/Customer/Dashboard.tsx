import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Calendar, Search, Star } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Manage your reservations and explore new dining experiences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> My Reservations
            </CardTitle>
            <CardDescription>View upcoming and past bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link to="/customer/reservations">View Reservations</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-accent" /> Discover
            </CardTitle>
            <CardDescription>Find your next favorite meal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-foreground">
              <Link to="/restaurants">Browse Restaurants</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-secondary/50 border-secondary-foreground/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary-foreground">
              <Star className="w-5 h-5" /> Reviews
            </CardTitle>
            <CardDescription>Look back at your experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full bg-background border">
              <Link to="/customer/reservations?tab=past">Leave a Review</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
