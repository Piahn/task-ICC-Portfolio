"use client";

import { PiArrowClockwiseBold } from "react-icons/pi";

import { User } from "@supabase/supabase-js";

import { Svg } from "@/components/shared/svg";

import { Button } from "@/components/ui/button";

import ContentForm from "@/components/form/content-form";

import authMutation from "@/mutation/auth.mutation";

const GuestbookForm = ({ user }: { user: User | null }) => {
  const { githubMutation } = authMutation();

  const handleSignIn = () => {
    githubMutation.mutate({ next: "/guestbook" });
  };

  return (
    <div className="flex flex-col">
      {user ? (
        <div className="flex w-full flex-col gap-y-2">
          <ContentForm />
        </div>
      ) : (
        <div className="flex w-full items-center">
          <Button
            className="flex w-full items-center justify-center gap-2"
            variant="secondary"
            aria-label="Login with GitHub"
            onClick={handleSignIn}
            disabled={githubMutation.isPending}
          >
            {githubMutation.isPending ? (
              <PiArrowClockwiseBold className="size-4 animate-spin" />
            ) : (
              <Svg name="github" className="size-3" />
            )}
            {githubMutation.isPending ? "Signing in..." : "Login with GitHub"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GuestbookForm;
