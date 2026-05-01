import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth, type UserRole } from "../../components/AuthProvider";

export function SignupPage() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-card rounded-[36px] p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Create account</h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--text-muted)]">
          Join as a diner or owner. The new UI keeps both roles inside one darker, more focused hospitality shell while preserving the existing auth flow.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            const formData = new FormData(event.currentTarget);

            try {
              await signUp({
                fullName: String(formData.get("fullName") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                role: String(formData.get("role") ?? "customer") as UserRole,
              });
              navigate("/dashboard", { replace: true });
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Unable to create account.");
            }
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Full name</span>
            <input name="fullName" className="field" placeholder="Maya Lin" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Email</span>
            <input name="email" type="email" className="field" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Password</span>
            <input name="password" type="password" className="field" placeholder="••••••••" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Role</span>
            <select name="role" className="field">
              <option value="customer">Customer</option>
              <option value="owner">Owner</option>
            </select>
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#7ad5d6]">
            Log in
          </Link>
        </p>
      </div>

      <div className="glass-card rounded-[36px] p-8">
        <p className="section-label">One platform</p>
        <div className="mt-6 space-y-4">
          <FeatureCard
            title="Customers"
            body="Browse restaurants, reserve faster, and revisit past bookings from a cleaner personal dashboard."
          />
          <FeatureCard
            title="Owners"
            body="Track reservations, ratings, and review volume from the same product language used on the guest side."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-card-soft rounded-[24px] p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </div>
  );
}
