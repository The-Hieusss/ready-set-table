import { ArrowLeft, ImagePlus, Loader2, MapPin, Phone, Sparkles, Store, UtensilsCrossed } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";
import { createRestaurant, getOwnedRestaurantById, type Restaurant, updateOwnedRestaurant } from "../../lib/supabase";
import { toast } from "sonner";

export default function RestaurantForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, accessToken } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<Restaurant>>({
    name: "",
    address: "",
    city: "",
    cuisine_type: "",
    description: "",
    phone: "",
    opening_hours: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    async function loadData() {
      if (!isEditing || !profile || !accessToken || !id) {
        setFetching(false);
        return;
      }

      try {
        const data = await getOwnedRestaurantById(id, profile.id, accessToken);
        if (data) {
          setFormData(data);
        }
      } catch {
        toast.error("Failed to load restaurant data.");
        navigate("/owner/restaurants");
      } finally {
        setFetching(false);
      }
    }

    void loadData();
  }, [accessToken, id, isEditing, navigate, profile]);

  const updateField = (key: keyof Restaurant, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profile || !accessToken) {
      toast.error("You must be signed in as an owner.");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      owner_id: profile.id,
      cuisine_type: formData.cuisine_type?.trim(),
      city: formData.city?.trim(),
    };

    try {
      if (isEditing) {
        if (!id) {
          throw new Error("Missing restaurant id");
        }

        await updateOwnedRestaurant(id, profile.id, payload, accessToken);
        toast.success("Restaurant updated successfully");
      } else {
        await createRestaurant(payload as Partial<Restaurant> & { owner_id: string }, accessToken);
        toast.success("Restaurant created successfully");
      }

      navigate("/owner/restaurants");
    } catch {
      toast.error("Failed to save restaurant.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <div className="glass-card flex items-center gap-3 rounded-[24px] px-5 py-4 text-sm text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading restaurant details…
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-label">Owner workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {isEditing ? "Edit restaurant" : "Add restaurant"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Create a listing that looks polished on the guest side. Cuisine type is free-form so owners can describe their concept precisely.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/owner/restaurants")}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="glass-card rounded-[32px] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Listing preview</p>
              <p className="text-sm text-[var(--text-muted)]">How your restaurant reads at a glance</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/[0.18]">
            <div className="aspect-[16/10] bg-[linear-gradient(145deg,rgba(6,18,70,0.9),rgba(0,122,123,0.62),rgba(15,17,25,0.92))]">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt={formData.name || "Restaurant preview"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/[0.42]">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {formData.name?.trim() || "Restaurant name"}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {formData.cuisine_type?.trim() || "Cuisine type"} • {formData.city?.trim() || "City"}
                  </p>
                </div>
                <span className="rounded-full bg-[rgba(253,160,41,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                  Preview
                </span>
              </div>

              <div className="space-y-2 text-sm text-[var(--text-muted)]">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#7ad5d6]" />
                  {formData.address?.trim() || "Address will appear here"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#7ad5d6]" />
                  {formData.phone?.trim() || "Phone number"}
                </p>
                <p className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-[#7ad5d6]" />
                  {formData.opening_hours?.trim() || "Opening hours"}
                </p>
              </div>

              <p className="text-sm leading-7 text-[var(--text-muted)]">
                {formData.description?.trim() || "Your restaurant description will help guests understand the room, the cuisine, and the overall experience."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <InfoNote
              icon={<Sparkles className="h-4 w-4" />}
              title="Use a clear cuisine label"
              body="Examples: Neo-Bistro, Coastal Mexican, Kyoto Omakase, or Plant-Based Tasting Menu."
            />
            <InfoNote
              icon={<MapPin className="h-4 w-4" />}
              title="Fill city explicitly"
              body="Your schema stores city separately, so this should not be buried only inside the address."
            />
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="glass-card rounded-[32px] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-semibold text-white">Restaurant details</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Fill in the public details for your restaurant.
              </p>
            </div>
            <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7ad5d6]">
              {isEditing ? "Editing" : "New listing"}
            </span>
          </div>

          <div className="mt-8 grid gap-6">
            <Field label="Restaurant Name *">
              <input
                required
                value={formData.name || ""}
                onChange={(event) => updateField("name", event.target.value)}
                className="field h-14"
                placeholder="Lune Dining House"
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
              <Field label="Address *">
                <input
                  required
                  value={formData.address || ""}
                  onChange={(event) => updateField("address", event.target.value)}
                  className="field h-14"
                  placeholder="1848 Camelback Rd"
                />
              </Field>
              <Field label="City *">
                <input
                  required
                  value={formData.city || ""}
                  onChange={(event) => updateField("city", event.target.value)}
                  className="field h-14"
                  placeholder="Phoenix"
                />
              </Field>
            </div>

            <Field
              label="Cuisine Type *"
              hint="Free text. Use the exact cuisine or concept you want guests to see."
            >
              <input
                required
                value={formData.cuisine_type || ""}
                onChange={(event) => updateField("cuisine_type", event.target.value)}
                className="field h-14"
                placeholder="Mediterranean, Modern French, Omakase, Fusion..."
              />
            </Field>

            <Field label="Description">
              <textarea
                className="field min-h-[150px] resize-none"
                value={formData.description || ""}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe the mood, cuisine, and what makes the dining experience distinctive..."
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Phone Number">
                <input
                  value={formData.phone || ""}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="field h-14"
                  placeholder="(602) 555-1848"
                />
              </Field>
              <Field label="Opening Hours">
                <input
                  value={formData.opening_hours || ""}
                  onChange={(event) => updateField("opening_hours", event.target.value)}
                  className="field h-14"
                  placeholder="Tue-Sun · 5:00 PM - 10:00 PM"
                />
              </Field>
            </div>

            <Field label="Image URL">
              <input
                type="url"
                value={formData.image_url || ""}
                onChange={(event) => updateField("image_url", event.target.value)}
                className="field h-14"
                placeholder="https://..."
              />
            </Field>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/owner/restaurants")}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-gold flex-1 disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isEditing ? "Save Changes" : "Create Restaurant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-white/[0.78]">{label}</span>
        {hint ? <span className="text-xs text-white/[0.42]">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function InfoNote({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-card-soft rounded-[24px] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-[#7ad5d6]">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </div>
  );
}
