import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useAuth } from "../../components/AuthProvider";
import {
  cancelReservation,
  completeReservation,
  createReview,
  getMyReviews,
  getReservations,
  type Reservation,
} from "../../lib/supabase";
import { toast } from "sonner";

type ReservationTab = "upcoming" | "completed" | "cancelled";

export function MyReservationsPage() {
  const { accessToken } = useAuth();
  const [tab, setTab] = useState<ReservationTab>("upcoming");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviewedReservationIds, setReviewedReservationIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [reviewingReservation, setReviewingReservation] = useState<Reservation | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadReservationData() {
      try {
        const [reservationRows, reviewRows] = await Promise.all([
          getReservations(accessToken ?? undefined),
          getMyReviews(accessToken ?? undefined),
        ]);

        setReservations(reservationRows);
        setReviewedReservationIds(
          reviewRows
            .map((review) => review.reservationId)
            .filter((reservationId): reservationId is string => Boolean(reservationId)),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadReservationData();
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

  async function handleCompleteReservation(reservationId: string) {
    if (!accessToken) {
      toast.error("You must be signed in to complete a reservation.");
      return;
    }

    setCompletingId(reservationId);

    try {
      const updated = await completeReservation(reservationId, accessToken);

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId && updated ? updated : reservation,
        ),
      );

      toast.success("Reservation marked as completed.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to complete reservation.",
      );
    } finally {
      setCompletingId(null);
    }
  }

  function openReviewDialog(reservation: Reservation) {
    setReviewingReservation(reservation);
    setReviewRating(5);
    setReviewComment("");
  }

  async function handleSubmitReview() {
    if (!accessToken || !reviewingReservation) {
      toast.error("You must be signed in to leave a review.");
      return;
    }

    setSubmittingReview(true);

    try {
      await createReview(
        {
          restaurantId: reviewingReservation.restaurantId,
          reservationId: reviewingReservation.id,
          rating: reviewRating,
          comment: reviewComment,
        },
        accessToken,
      );

      setReviewedReservationIds((current) =>
        current.includes(reviewingReservation.id)
          ? current
          : [...current, reviewingReservation.id],
      );
      setReviewingReservation(null);
      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit your review.",
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <>
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
            {filtered.map((reservation) => {
              const hasReview = reviewedReservationIds.includes(reservation.id);

              return (
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
                  <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                    {reservation.status === "upcoming" ? (
                      <>
                        <button
                          type="button"
                          disabled={completingId === reservation.id || cancellingId === reservation.id}
                          onClick={() => void handleCompleteReservation(reservation.id)}
                          className="rounded-full border border-[rgba(122,213,214,0.22)] bg-[rgba(0,122,123,0.14)] px-4 py-2 text-sm font-medium text-[#7ad5d6] transition hover:bg-[rgba(0,122,123,0.2)] disabled:opacity-60"
                        >
                          {completingId === reservation.id ? "Completing…" : "Mark completed"}
                        </button>
                        <button
                          type="button"
                          disabled={cancellingId === reservation.id || completingId === reservation.id}
                          onClick={() => void handleCancelReservation(reservation.id)}
                          className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6] disabled:opacity-60"
                        >
                          {cancellingId === reservation.id ? "Cancelling…" : "Cancel"}
                        </button>
                      </>
                    ) : reservation.status === "completed" ? (
                      hasReview ? (
                        <span className="rounded-full border border-[rgba(122,213,214,0.22)] bg-[rgba(0,122,123,0.14)] px-4 py-2 text-sm font-medium text-[#7ad5d6]">
                          Reviewed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openReviewDialog(reservation)}
                          className="rounded-full border border-[rgba(253,160,41,0.2)] bg-[rgba(253,160,41,0.12)] px-4 py-2 text-sm font-medium text-[var(--brand-gold)] transition hover:bg-[rgba(253,160,41,0.2)]"
                        >
                          Leave review
                        </button>
                      )
                    ) : (
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-[var(--text-muted)]">
                        Cancelled
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(reviewingReservation)}
        onOpenChange={(open) => {
          if (!open && !submittingReview) {
            setReviewingReservation(null);
          }
        }}
      >
        <DialogContent className="border border-white/[0.1] bg-[rgba(8,11,24,0.96)] p-0 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-xl">
          <div className="p-6 sm:p-7">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
                Leave a review
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-[var(--text-muted)]">
                {reviewingReservation
                  ? `Share feedback for ${reviewingReservation.restaurantName}. Each completed reservation can be reviewed once.`
                  : "Share feedback for your reservation."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                  Rating
                </p>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                        value <= reviewRating
                          ? "border-[rgba(253,160,41,0.35)] bg-[rgba(253,160,41,0.16)] text-[var(--brand-gold)]"
                          : "border-white/[0.1] bg-white/[0.04] text-white/[0.4] hover:border-white/[0.2] hover:text-white"
                      }`}
                    >
                      <Star className={`h-5 w-5 ${value <= reviewRating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.36]">
                  Comment
                </span>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={5}
                  placeholder="What stood out about the food, service, or overall experience?"
                  className="min-h-[140px] w-full rounded-[24px] border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/[0.28] focus:border-[rgba(122,213,214,0.38)] focus:bg-white/[0.06]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setReviewingReservation(null)}
                  disabled={submittingReview}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmitReview()}
                  disabled={submittingReview}
                  className="btn-gold disabled:opacity-60"
                >
                  {submittingReview ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
