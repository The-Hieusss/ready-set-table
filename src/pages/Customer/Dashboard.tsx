import { ArrowRight, CalendarClock, MessageSquareQuote, Star } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";

export function CustomerDashboardPage() {
  const { profile } = useAuth();

  return (
    <section className="space-y-8">
      <div className="glass-card rounded-[32px] p-8">
        <p className="section-label">Dashboard overview</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Welcome back, {profile?.fullName ?? "Guest"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
          Upcoming reservations, completed visits, and pending reviews are now presented in the same liquid hospitality style as the public booking flow.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Upcoming reservations"
          value="2"
          accent="teal"
        />
        <StatCard
          icon={<MessageSquareQuote className="h-5 w-5" />}
          label="Pending reviews"
          value="1"
          accent="gold"
        />
        <StatCard icon={<Star className="h-5 w-5" />} label="Favorite venues" value="8" accent="navy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Reservation activity
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Move between upcoming and completed bookings from one connected timeline.
              </p>
            </div>
            <Link to="/reservations" className="btn-gold">
              View reservations
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {[
              { title: "Amber Yard", time: "May 4 at 7:30 PM", meta: "Party of 2" },
              { title: "Atelier Noir", time: "Apr 18 at 8:00 PM", meta: "Review submitted" },
            ].map((item) => (
              <div key={item.title} className="glass-card-soft flex items-center justify-between rounded-[24px] p-5">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--text-muted)]">{item.meta}</span>
                  <ArrowRight className="h-4 w-4 text-white/[0.36]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Next actions</h2>
          <div className="mt-6 space-y-4">
            <ActionCard
              title="Leave review"
              body="You have one completed booking ready for guest feedback."
            />
            <ActionCard
              title="Browse more restaurants"
              body="Use the discovery page to find another venue without leaving the flow."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-card-soft rounded-[24px] p-5">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent: "teal" | "gold" | "navy";
}) {
  const accentClass =
    accent === "teal"
      ? "bg-[rgba(0,122,123,0.18)] text-[#7ad5d6]"
      : accent === "gold"
        ? "bg-[rgba(253,160,41,0.16)] text-[var(--brand-gold)]"
        : "bg-[rgba(6,18,70,0.32)] text-[#b9c3ff]";

  return (
    <div className="glass-card rounded-[28px] p-6">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${accentClass}`}>
        {icon}
        Snapshot
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}
