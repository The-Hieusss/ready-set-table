import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  getAppProfile,
  signInWithPassword,
  signOutSession,
  signUpWithPassword,
} from "../lib/supabase";

export type UserRole = "customer" | "owner";

export type AppProfile = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  profile: AppProfile | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "ready-set-table-auth-token";

function profileFromAppUser(user: {
  id: string;
  full_name?: string;
  email?: string;
  role?: unknown;
}): AppProfile {
  return {
    id: user.id,
    fullName: String(user.full_name ?? user.email ?? "Guest User"),
    email: String(user.email ?? ""),
    role: user.role === "owner" ? "owner" : "customer",
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await getAppProfile(token);
        setAccessToken(token);
        setProfile(user ? profileFromAppUser(user) : null);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      accessToken,
      loading,
      signIn: async (email, password) => {
        setLoading(true);
        try {
          const session = await signInWithPassword(email, password);
          window.localStorage.setItem(STORAGE_KEY, session.access_token);
          setAccessToken(session.access_token);
          const profile = await getAppProfile(session.access_token);
          setProfile(profile ? profileFromAppUser(profile) : null);
        } finally {
          setLoading(false);
        }
      },
      signUp: async ({ fullName, email, password, role }) => {
        setLoading(true);
        try {
          const session = await signUpWithPassword({
            email,
            password,
            fullName,
            role,
          });

          if (session?.access_token && session.user) {
            window.localStorage.setItem(STORAGE_KEY, session.access_token);
            setAccessToken(session.access_token);
            const profile = await getAppProfile(session.access_token);
            setProfile(profile ? profileFromAppUser(profile) : null);
          }
        } finally {
          setLoading(false);
        }
      },
      signOut: async () => {
        if (accessToken) {
          try {
            await signOutSession(accessToken);
          } catch {
            // local cleanup still matters if the remote sign out fails
          }
        }

        window.localStorage.removeItem(STORAGE_KEY);
        setAccessToken(null);
        setProfile(null);
      },
    }),
    [accessToken, loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
