import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { createClient } from "@/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      // Get target URL from cookie or query params
      let next = searchParams.get("next");
      if (!next && typeof document !== "undefined") {
        const match = document.cookie.match(/next=([^;]+)/);
        if (match) {
          next = decodeURIComponent(match[1]);
        }
      }
      navigate(next || "/", { replace: true });
    });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center font-mono text-sm text-muted-foreground">
      Authenticating...
    </div>
  );
}
