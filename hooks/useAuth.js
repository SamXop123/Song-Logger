"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export function useAuth() {
  const configured = isSupabaseConfigured();
  const supabase = configured ? getSupabaseBrowserClient() : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
        }

        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch((sessionError) => {
        if (!active) return;
        setError(sessionError.message || "Failed to restore your session.");
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      const nextError = new Error("Supabase is not configured yet.");
      setError(nextError.message);
      return { error: nextError };
    }

    setError("");

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (signInError) {
      setError(signInError.message);
    }

    return { error: signInError };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: null };

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return { error: signOutError };
    }

    setUser(null);
    return { error: null };
  }, [supabase]);

  return {
    user,
    loading,
    error,
    isConfigured: configured,
    signInWithGoogle,
    signOut,
  };
}
