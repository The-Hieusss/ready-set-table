import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../components/AuthProvider";
import { cancelReservation, getReservations, type Reservation } from "../../lib/supabase";
import { toast } from "sonner";

type ReservationTab = "upcoming" | "completed" | "cancelled";

export function MyReservationsPage() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<ReservationTab>("upcoming");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    getReservations(accessToken ?? undefined)
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const filtered = useMemo(
    () => reservations.filter((reservation) => reservation.status === tab),
    [reservations, tab],
  );

  async function handleCancelReservation(reservationId: string) {
    if (!accessToken) {
      toast.error("You must be signed in to cancel a reservation.");
      return;
    }

    setCancellingId(reservationId);

    try {
      const updated = await cancelReservation(reservationId, accessToken);

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId && updated ? updated : reservation,
        ),
      );

      toast.success("Reservation cancelled.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to cancel reservation.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="space-y-8">
      <div className="glass-card rounded-[32px] p-8">
        <p className="section-label">Reservations & bookings</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          My reservations
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["upcoming", "completed", "cancelled"] as ReservationTab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={
              tab === item
                ? "rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold capitalize text-[var(--brand-navy)]"
                : "rounded-full border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-sm font-medium capitalize text-[var(--text-muted)]"
            }
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card rounded-[28px] p-8 text-sm text-[var(--text-muted)]">
          Loading reservations…
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((reservation) => (
            <article
              key={reservation.id}
              className="glass-card grid gap-5 rounded-[28px] p-5 md:grid-cols-[1.3fr_1fr_auto]"
            >
              <div>
                <p className="text-xl font-semibold tracking-tight text-white">
                  {reservation.restaurantName}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {reservation.date} at {reservation.time}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Party size {reservation.partySize}
                </p>
              </div>
              <div className="flex items-center">
                <span className="rounded-full bg-[rgba(0,122,123,0.18)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7ad5d6]">
                  {reservation.status}
                </span>
              </div>
              <div className="flex items-center justify-start md:justify-end">
                {reservation.status === "upcoming" ? (
                  <button
                    type="button"
                    disabled={cancellingId === reservation.id}
                    onClick={() => void handleCancelReservation(reservation.id)}
                    className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6] disabled:opacity-60"
                  >
                    {cancellingId === reservation.id ? "Cancelling…" : "Cancel"}
                  </button>
                ) : (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-[var(--text-muted)]">
                    {reservation.status === "completed" ? "Completed" : "Cancelled"}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
