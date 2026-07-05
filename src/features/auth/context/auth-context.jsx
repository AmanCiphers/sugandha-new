"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const fetchProfile = async (session) => {
      const supabase2 = createClient();
      const { data: profile } = await supabase2
        .from("profiles")
        .select("full_name, role")
        .eq("id", session.user.id)
        .single();

      if (!cancelled) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || profile?.full_name || "",
          role: profile?.role || "customer",
        });
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session?.user) {
        fetchProfile(session);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Network error. Check your connection." };
    }
  }, []);

  const signUp = useCallback(async (email, password, name) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { success: false, error: error.message };
      return { success: true, needsConfirmation: !data.session };
    } catch (err) {
      return { success: false, error: err.message || "Network error. Check your connection." };
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
