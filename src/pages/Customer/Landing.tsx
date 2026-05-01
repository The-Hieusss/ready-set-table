import { ArrowRight, CalendarDays, Clock3, MapPin, Star, UserRound, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const featuredRestaurants = [
  {
    name: "L'Orizon Sky Lounge",
    cuisine: "Modern French",
    location: "Manhattan",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    description:
      "Panoramic skyline views, seasonal tasting menus, and a room designed for premium evening bookings.",
  },
  {
    name: "Amber & Ice",
    cuisine: "Mixology",
    location: "Brooklyn",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "The Glass Kitchen",
    cuisine: "Contemporary",
    location: "SoHo",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  },
];

const guestStories = [
  {
    name: "Marcus Thorne",
    title: "Tech Executive",
    quote:
      "The booking flow is fast enough to use mid-conversation. It feels more like a concierge than a search app.",
  },
  {
    name: "Elena Rodriguez",
    title: "Food Critic",
    quote:
      "The UI makes good restaurants feel curated instead of buried under clutter. That changes discovery quality.",
  },
];

export function LandingPage() {
  return (
    <div className="space-y-20 pb-6">
      <section className="relative overflow-hidden rounded-[36px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80"
            alt="Restaurant dining room"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,16,23,0.72),rgba(13,16,23,0.42),rgba(13,16,23,0.94))]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-180 max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="section-label">Guest landing page</p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Book your next table in minutes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            Discover high-intent dining spots, confirm reservations faster, and keep the guest and operator experience in one connected system.
          </p>

          <div className="hero-search-panel mt-10 w-full max-w-5xl rounded-4xl p-4 text-left sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <p className="text-sm font-semibold text-white">Search tables faster</p>
                <p className="mt-1 text-sm text-white/[0.56]">
                  One search surface for location, cuisine, schedule, and party size.
                </p>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {["Tonight", "Outdoor", "Top rated"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/68"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.3fr_1fr_1fr_0.9fr_auto]">
              <SearchField
                icon
                label="Location"
                placeholder="City, address, or neighborhood"
              />
              <SearchField
                icon
                label="Cuisine"
                placeholder="Italian, sushi, rooftop..."
              />
              <SearchField
                icon
                label="Date"
                placeholder="Friday, May 3"
              />
              <SearchField
                icon
                label="Party size"
                placeholder="2 guests"
              />
              <div className="flex items-end">
                <Link to="/restaurants" className="btn-gold h-14.5 w-full px-6">
                  Find a table
                </Link>
              </div>
            </div>

            <div className="mt-3 grid gap-2 border-t border-white/8 pt-4 text-sm text-white/56 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#7ad5d6]" />
                Phoenix, Scottsdale, Tempe
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#7ad5d6]" />
                Real-time availability
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[var(--brand-gold)]" />
                Top rated dining rooms
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <StepCard
          title="Browse"
          body="Search by location, cuisine, and dining style without wasting screen space on low-value friction."
        />
        <StepCard
          title="Reserve"
          body="Pick a date, time, and party size from the restaurant detail page and move straight to confirmation."
        />
        <StepCard
          title="Review"
          body="Track completed visits and pending feedback from the customer dashboard after the reservation closes."
        />
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Featured restaurants</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Featured experiences
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="hidden items-center gap-2 text-sm font-semibold text-[#7ad5d6] transition hover:text-white sm:inline-flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="glass-card overflow-hidden rounded-[30px]">
            <div className="h-80 overflow-hidden">
              <img
                src={featuredRestaurants[0].image}
                alt={featuredRestaurants[0].name}
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="space-y-5 p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold tracking-tight text-white">
                    {featuredRestaurants[0].name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {featuredRestaurants[0].cuisine} • {featuredRestaurants[0].location}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[rgba(253,160,41,0.14)] px-4 py-2 font-semibold text-[var(--brand-gold)]">
                  <Star className="h-4 w-4 fill-current" />
                  {featuredRestaurants[0].rating}
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                {featuredRestaurants[0].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/restaurants" className="btn-gold">
                  Book Table
                </Link>
                <Link to="/restaurants" className="btn-outline">
                  View details
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {featuredRestaurants.slice(1).map((restaurant) => (
              <article key={restaurant.name} className="glass-card overflow-hidden rounded-[28px]">
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{restaurant.name}</h3>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {restaurant.cuisine} • {restaurant.location}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--brand-gold)]">
                      {restaurant.rating} ★
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <p className="section-label">Guest stories</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What diners notice first
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {guestStories.map((story) => (
            <article key={story.name} className="glass-card rounded-[28px] p-8">
              <div className="mb-6 flex gap-1 text-[var(--brand-gold)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-lg italic leading-8 text-white/[0.92]">“{story.quote}”</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.08]">
                  <UserRound className="h-5 w-5 text-[#7ad5d6]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{story.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{story.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchField({
  icon,
  label,
  placeholder,
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block px-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#7ad5d6]">
        {label}
      </span>
      <div className="search-field group relative overflow-hidden rounded-[22px]">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/[0.38] transition group-focus-within:text-[#7ad5d6]">
            {icon}
          </span>
        ) : null}
        <input
          className={`etched-input h-[58px] rounded-[22px] border-0 bg-transparent pr-4 ${icon ? "pl-11" : "pl-4"}`}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function StepCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-card rounded-[28px] p-6">
      <div className="inline-flex rounded-full bg-[rgba(0,122,123,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7ad5d6]">
        {title}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </div>
  );
}
