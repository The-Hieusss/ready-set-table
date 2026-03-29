import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, Restaurant } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: '',
    address: '',
    cuisine_type: 'Italian',
    description: '',
    phone: '',
    opening_hours: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    async function loadData() {
      if (!isEditing || !user) return;
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('restaurant_id', id)
          .eq('owner_id', user.user_id)
          .single();
        
        if (error) throw error;
        if (data) setFormData(data);
      } catch (err) {
        toast.error('Failed to load restaurant data.');
        navigate('/owner/restaurants');
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id, isEditing, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const payload = { ...formData, owner_id: user.user_id };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('restaurants')
          .update(payload)
          .eq('restaurant_id', id)
          .eq('owner_id', user.user_id);
        if (error) throw error;
        toast.success('Restaurant updated successfully');
      } else {
        const { error } = await supabase
          .from('restaurants')
          .insert(payload);
        if (error) throw error;
        toast.success('Restaurant created successfully');
      }
      navigate('/owner/restaurants');
    } catch (err: any) {
      toast.error('Failed to save restaurant.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-foreground">{isEditing ? 'Edit Restaurant' : 'Add Restaurant'}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Details</CardTitle>
          <CardDescription>Fill in the public details for your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name *</Label>
              <Input id="name" required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" required value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type *</Label>
              <Select value={formData.cuisine_type} onValueChange={val => setFormData({ ...formData, cuisine_type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="American">American</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                className="w-full min-h-[100px] border-border bg-background p-3 rounded-md text-sm border focus-visible:ring-1 focus-visible:ring-ring outline-none" 
                id="description" 
                value={formData.description || ''} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Describe your restaurant's story and vibe..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Opening Hours</Label>
                <Input id="hours" placeholder="e.g. 5:00 PM - 10:00 PM" value={formData.opening_hours || ''} onChange={e => setFormData({ ...formData, opening_hours: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" type="url" placeholder="https://..." value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
              {formData.image_url && (
                <div className="mt-4 aspect-video bg-muted rounded-md overflow-hidden relative border">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/owner/restaurants')}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditing ? 'Save Changes' : 'Create Restaurant'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
