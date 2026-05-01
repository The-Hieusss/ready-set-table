import { MessageSquareText } from "lucide-react";
import { type PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "./Navbar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-[var(--text-main)]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-white/[0.06] bg-black/[0.18]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div className="space-y-4">
            <p className="text-xl font-black tracking-tight text-white/[0.9]">Ready Set Table.</p>
            <p className="max-w-md text-sm leading-7 text-[var(--text-muted)]">
              A dining operations and reservation product shaped by the LiquidTable visual system and connected to Supabase-backed auth and data flows.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-6 text-sm text-[var(--text-muted)]">
            <Link className="transition hover:text-white" to="/">
              Home
            </Link>
            <Link className="transition hover:text-white" to="/restaurants">
              Browse
            </Link>
            <Link className="transition hover:text-white" to="/dashboard">
              Dashboard
            </Link>
            <Link className="transition hover:text-white" to="/owner">
              Owner
            </Link>
          </div>
        </div>
      </footer>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.12] bg-[var(--brand-teal)] text-white shadow-[0_18px_40px_rgba(0,122,123,0.34)] transition hover:scale-105"
      >
        <MessageSquareText className="h-5 w-5" />
      </button>
    </div>
  );
}
