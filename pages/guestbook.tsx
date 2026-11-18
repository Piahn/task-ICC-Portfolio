import { useEffect, useState } from "react";

import type { User } from "@supabase/supabase-js";

import GuestbookForm from "@/components/form/guestbook-form";
import SectionWrapper from "@/components/motion/section-wrapper";
import GuestbookSection from "@/components/section/guestbook-section";
import Paragraph from "@/components/shared/paragraph";
import { createClient } from "@/supabase/client";

export default function GuestbookPage() {
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
          console.warn("Supabase auth error in Guestbook:", err);
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
      console.warn("Supabase client init error in Guestbook:", err);
      return () => {
        isMounted = false;
      };
    }
  }, []);

  return (
    <SectionWrapper
      id="guestbook"
      className="flex flex-col items-center gap-y-16 px-4 md:gap-y-20 lg:gap-y-24"
    >
      <div className="w-full space-y-4">
        <Paragraph title="Guestbook">
          <p>
            Leave me a trace of your visit, could be a message, a quote, or a
            song you'd want me to listen to.
          </p>
        </Paragraph>
        <GuestbookForm user={user} />
      </div>
      <GuestbookSection user={user} />
    </SectionWrapper>
  );
}
