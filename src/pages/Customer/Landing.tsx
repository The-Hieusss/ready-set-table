import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, UtensilsCrossed, Star, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-0" />
        <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-5xl text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Book your next table <br className="hidden md:inline" /> in <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">minutes</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed">
              Discover the best restaurants in your city. Browse, reserve, and review with ease.
            </p>
            
            <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-sm sm:max-w-2xl items-center space-x-2 bg-background p-2 rounded-full shadow-lg border border-border/50">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="City, address, or cuisine..."
                  className="w-full pl-10 border-0 shadow-none focus-visible:ring-0 rounded-full bg-transparent text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="default" className="rounded-full px-8 h-12 text-md font-semibold bg-primary hover:bg-primary/90 hidden sm:flex">
                Search
              </Button>
              <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 sm:hidden">
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured/Value Prop */}
      <section className="py-20 bg-background flex-1">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full ring-8 ring-primary/5">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">1. Browse</h3>
              <p className="text-muted-foreground max-w-[300px]">Find the perfect spot filtered by cuisine, rating, and location.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-accent/10 rounded-full ring-8 ring-accent/5">
                <UtensilsCrossed className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">2. Reserve</h3>
              <p className="text-muted-foreground max-w-[300px]">Book your table instantly. No calls needed, just a few clicks.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full ring-8 ring-primary/5">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">3. Review</h3>
              <p className="text-muted-foreground max-w-[300px]">Share your experience and help the community find hidden gems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 bg-foreground text-background">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Are you a restaurant owner?</h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of restaurants managing their reservations through Ready Set Table.
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/signup">List your restaurant <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
