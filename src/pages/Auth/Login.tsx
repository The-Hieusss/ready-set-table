import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";

export function LoginPage() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="glass-card relative overflow-hidden rounded-[36px] p-8">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
            alt="Restaurant bar"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,70,0.75),rgba(0,122,123,0.4),rgba(13,16,23,0.92))]" />
        </div>
        <div className="relative z-10">
          <p className="section-label">Welcome back</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
            Manage reservations without the noise
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/[0.72]">
            Sign in to access bookings, guest activity, and operator tools from the redesigned hospitality dashboard.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-[36px] p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Log in</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Use your Supabase account credentials.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            const formData = new FormData(event.currentTarget);

            try {
              await signIn(
                String(formData.get("email") ?? ""),
                String(formData.get("password") ?? ""),
              );
              navigate(redirectTo, { replace: true });
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Unable to log in.");
            }
          }}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Email</span>
            <input name="email" type="email" className="field" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/[0.72]">Password</span>
            <input name="password" type="password" className="field" placeholder="••••••••" />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Need an account?{" "}
          <Link to="/signup" className="font-medium text-[#7ad5d6]">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
