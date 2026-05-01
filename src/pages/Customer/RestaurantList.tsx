import { Check, Filter, LayoutGrid, List, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { RestaurantCard } from "../../components/RestaurantCard";
import { getRestaurants, type Restaurant } from "../../lib/supabase";

const RATING_OPTIONS = [
  { label: "Any rating", value: "0" },
  { label: "4.5 and above", value: "4.5" },
  { label: "4.0 and above", value: "4.0" },
  { label: "3.5 and above", value: "3.5" },
];

export function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minimumRating, setMinimumRating] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .finally(() => setLoading(false));
  }, []);

  const cuisineOptions = useMemo(
    () =>
      [...new Set(restaurants.map((restaurant) => restaurant.cuisine.trim()).filter(Boolean))].sort(
        (left, right) => left.localeCompare(right),
      ),
    [restaurants],
  );

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minRating = Number(minimumRating);

    return restaurants.filter((restaurant) => {
      const matchesSearch =
        !query ||
        [restaurant.name, restaurant.address, restaurant.city, restaurant.cuisine]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCuisine =
        selectedCuisines.length === 0 ||
        selectedCuisines.some(
          (cuisine) => restaurant.cuisine.toLowerCase() === cuisine.toLowerCase(),
        );

      const matchesRating =
        minRating === 0 ||
        (typeof restaurant.rating === "number" && restaurant.rating >= minRating);

      return matchesSearch && matchesCuisine && matchesRating;
    });
  }, [minimumRating, restaurants, search, selectedCuisines]);

  function toggleCuisine(cuisine: string) {
    setSelectedCuisines((current) =>
      current.includes(cuisine)
        ? current.filter((item) => item !== cuisine)
        : [...current, cuisine],
    );
  }

  function clearFilters() {
    setSearch("");
    setSelectedCuisines([]);
    setMinimumRating("0");
  }

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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/[0.36] transition hover:text-white"
              >
                Reset
              </button>
              <Filter className="h-5 w-5 text-[#7ad5d6]" />
            </div>
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
              {cuisineOptions.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  Cuisine options will appear once restaurants are available.
                </p>
              ) : (
                <div className="space-y-3 text-sm text-[var(--text-muted)]">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-left transition hover:border-[rgba(122,213,214,0.4)] hover:bg-white/[0.06]"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                          selectedCuisines.includes(cuisine)
                            ? "border-[#7ad5d6] bg-[#7ad5d6] text-[var(--brand-navy)]"
                            : "border-white/[0.16] bg-transparent text-transparent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {cuisine}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                Rating
              </p>
              <select
                value={minimumRating}
                onChange={(event) => setMinimumRating(event.target.value)}
                className="field"
              >
                {RATING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
          ) : filteredRestaurants.length === 0 ? (
            <div className="glass-card rounded-[28px] p-8 text-center">
              <p className="text-xl font-semibold text-white">No restaurants match these filters</p>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Broaden the search, remove cuisine constraints, or lower the rating threshold.
              </p>
              <button type="button" onClick={clearFilters} className="btn-outline mt-6">
                Clear filters
              </button>
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
