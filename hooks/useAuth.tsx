"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, onIdTokenChanged, type FirebaseUser } from "@/lib/firebase/client";

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  /** Returns the current ID token, refreshing it if needed — pass this in Authorization headers. */
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  loading: true,
  getIdToken: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setFirebaseUser(user);
      setLoading(false);
      if (user) {
        const idToken = await user.getIdToken();
        fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }).catch(() => {
          // Best-effort: a failed sync just means middleware/SSR fall back
          // to treating the user as logged out until the next refresh —
          // client-side fetches still work via getIdToken() regardless.
        });
      } else {
        fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
      }
    });
    return unsubscribe;
  }, []);

  const getIdToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, loading, getIdToken }}>{children}</AuthContext.Provider>
  );
}

/** Client-side hook: { firebaseUser, loading, getIdToken }. Use inside AuthProvider. */
export function useAuth() {
  return useContext(AuthContext);
}
