import { Filter, LayoutGrid, List, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { RestaurantCard } from "../../components/RestaurantCard";
import { getRestaurants, type Restaurant } from "../../lib/supabase";

export function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.address, restaurant.city, restaurant.cuisine]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [restaurants, search]);

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <p className="section-label">Browse & discover</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Culinary discoveries
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
          Discover restaurants through a faster search surface and a cleaner browse layout, while keeping the live data layer underneath.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="glass-card h-fit rounded-[28px] p-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Filters</h2>
            <Filter className="h-5 w-5 text-[#7ad5d6]" />
          </div>

          <div className="mt-8 space-y-8">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                Search
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="City, address, cuisine, or restaurant"
                className="etched-input"
              />
            </label>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                Cuisine type
              </p>
              <div className="space-y-3 text-sm text-[var(--text-muted)]">
                {["Italian", "Japanese", "French", "Fusion"].map((cuisine, index) => (
                  <label key={cuisine} className="flex items-center gap-3">
                    <span
                      className={`h-4 w-4 rounded-sm border ${
                        index === 0
                          ? "border-[#7ad5d6] bg-[#7ad5d6]"
                          : "border-white/[0.16] bg-transparent"
                      }`}
                    />
                    {cuisine}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                Rating
              </p>
              <select className="field">
                <option>4.5 and above</option>
                <option>4.0 and above</option>
                <option>3.5 and above</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-white/[0.08]">
              <div className="relative h-36">
                <img
                  src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80"
                  alt="Map view"
                  className="h-full w-full object-cover brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"
                  >
                    <Map className="h-3.5 w-3.5" />
                    Show Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {loading ? "Loading restaurants" : `${filteredRestaurants.length} dining destinations`}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Filtered through the current Supabase-backed restaurant dataset.
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="glass-card rounded-xl p-3 text-[#7ad5d6]">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button type="button" className="glass-card-soft rounded-xl p-3 text-white/[0.36]">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="glass-card rounded-[28px] p-8 text-sm text-[var(--text-muted)]">
              Loading restaurants…
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
