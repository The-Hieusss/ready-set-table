import { ChefHat, MessageSquareText } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "./Navbar";

export function AppShell({ children }: PropsWithChildren) {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen text-[var(--text-main)]">
      <AnimatePresence>
        {showLoadingScreen ? <LoadingScreen /> : null}
      </AnimatePresence>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-white/[0.06] bg-black/[0.18]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div className="space-y-4">
            <p className="text-xl font-black tracking-tight text-white/[0.9]">Ready Set Table.</p>
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

function LoadingScreen() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="loading-screen fixed inset-0 z-[100] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: "easeOut" }}
    >
      <motion.div
        className="glass-card specular-glow flex w-full max-w-sm flex-col items-center rounded-[32px] px-8 py-10 text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="loading-screen__mark mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.12] bg-white/[0.06] text-[var(--brand-gold)]"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  scale: [1, 1.06, 1],
                  borderColor: [
                    "rgba(255, 255, 255, 0.12)",
                    "rgba(253, 160, 41, 0.32)",
                    "rgba(255, 255, 255, 0.12)",
                  ],
                }
          }
          transition={{
            duration: 1.2,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <ChefHat className="h-8 w-8" />
        </motion.div>
        <motion.p
          className="section-label"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.12, duration: 0.36 }}
        >
          Ready Set Table
        </motion.p>
        <motion.h1
          className="mt-3 text-3xl font-black tracking-tight text-white"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.42 }}
        >
          Preparing your table
        </motion.h1>
        <motion.div
          className="mt-8 flex items-center gap-2"
          aria-hidden="true"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.12,
              },
            },
          }}
        >
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="loading-screen__dot"
              variants={{
                hidden: { opacity: 0.35, y: 0 },
                visible: {
                  opacity: prefersReducedMotion ? 0.75 : [0.35, 1, 0.35],
                  y: prefersReducedMotion ? 0 : [0, -4, 0],
                },
              }}
              transition={{
                duration: 0.9,
                repeat: prefersReducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
