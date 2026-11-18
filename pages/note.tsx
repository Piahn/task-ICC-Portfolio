import { useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import NoteSection from "@/components/section/note-section";
import { createClient } from "@/supabase/client";

export default function NotePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    try {
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then((res) => {
          if (isMounted) {
            setUser(res?.data?.user ?? null);
          }
        })
        .catch((err) => {
          console.warn("Supabase auth error in Note:", err);
          if (isMounted) setUser(null);
        });

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (isMounted) {
            setUser(session?.user ?? null);
          }
        },
      );

      return () => {
        isMounted = false;
        authListener?.subscription?.unsubscribe();
      };
    } catch (err) {
      console.warn("Supabase client init error in Note:", err);
      return () => {
        isMounted = false;
      };
    }
  }, []);

  return <NoteSection initialUser={user} />;
}
