import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth, type UserRole } from "./AuthProvider";

type RoleGuardProps = PropsWithChildren<{
  role?: UserRole;
}>;

export function RoleGuard({ children, role }: RoleGuardProps) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 shadow-sm">
          Loading your account…
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && profile.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
