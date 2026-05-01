import { Bell, Heart, Menu, Utensils, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

function navLinkClass(isActive: boolean) {
  return isActive
    ? "text-[var(--brand-gold)]"
    : "text-[var(--text-muted)] transition hover:text-white";
}

function mobileNavLinkClass(isActive: boolean) {
  return isActive
    ? "rounded-2xl border border-[rgba(253,160,41,0.28)] bg-[rgba(253,160,41,0.14)] px-4 py-3 text-sm font-semibold text-[var(--brand-gold)]"
    : "rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.28)] hover:text-[#7ad5d6]";
}

export function Navbar() {
  const { profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card rounded-[28px] px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <Utensils className="h-6 w-6 text-(--brand-gold)" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-white sm:text-base">
                  Ready Set Table
                </p>
                <p className="hidden truncate text-[10px] uppercase tracking-[0.24em] text-white/[0.36] sm:block">
                  Hospitality system
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
              <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
                Home
              </NavLink>
              <NavLink to="/restaurants" className={({ isActive }) => navLinkClass(isActive)}>
                Discover
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => navLinkClass(isActive)}>
                Dashboard
              </NavLink>
              {profile?.role === "owner" ? (
                <NavLink to="/owner" className={({ isActive }) => navLinkClass(isActive)}>
                  Owner
                </NavLink>
              ) : null}
            </nav>

            <div className="hidden items-center gap-2 lg:flex xl:gap-3">
              <div className="relative hidden xl:block">
                <input
                  className="etched-input w-56 py-2 pl-4 pr-4 text-sm 2xl:w-64"
                  placeholder="Search venues..."
                />
              </div>
              <button
                type="button"
                className="hidden rounded-full p-2 text-white/[0.6] transition hover:bg-white/[0.06] hover:text-white xl:inline-flex"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="hidden rounded-full p-2 text-white/[0.6] transition hover:bg-white/[0.06] hover:text-white xl:inline-flex"
              >
                <Bell className="h-4 w-4" />
              </button>
              {profile ? (
                <>
                  <div className="hidden rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/[0.76] 2xl:block">
                    {profile.fullName}
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                    }}
                    className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6] disabled:opacity-60"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold text-[var(--brand-navy)] transition hover:opacity-90"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06] text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen ? (
            <div className="mt-4 border-t border-white/[0.08] pt-4 lg:hidden">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    className="etched-input pl-4"
                    placeholder="Search venues..."
                  />
                </div>

                <nav className="grid gap-2">
                  <NavLink to="/" className={({ isActive }) => mobileNavLinkClass(isActive)}>
                    Home
                  </NavLink>
                  <NavLink
                    to="/restaurants"
                    className={({ isActive }) => mobileNavLinkClass(isActive)}
                  >
                    Discover
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => mobileNavLinkClass(isActive)}
                  >
                    Dashboard
                  </NavLink>
                  {profile?.role === "owner" ? (
                    <NavLink
                      to="/owner"
                      className={({ isActive }) => mobileNavLinkClass(isActive)}
                    >
                      Owner
                    </NavLink>
                  ) : null}
                </nav>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06] text-white/[0.7]"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06] text-white/[0.7]"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  {profile ? (
                    <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.1] bg-white/[0.06] px-4 py-3">
                      <p className="truncate text-sm font-medium text-white">{profile.fullName}</p>
                      <p className="truncate text-xs text-white/[0.5]">{profile.email}</p>
                    </div>
                  ) : null}
                </div>

                {profile ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                    }}
                    className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6] disabled:opacity-60"
                  >
                    Log out
                  </button>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Link
                      to="/login"
                      className="rounded-2xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-center text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-2xl bg-[var(--brand-gold)] px-4 py-3 text-center text-sm font-bold text-[var(--brand-navy)] transition hover:opacity-90"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
