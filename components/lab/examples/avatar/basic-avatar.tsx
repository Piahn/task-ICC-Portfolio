import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BasicAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src="/assets/ava.webp" alt="User Avatar" />
      <AvatarFallback>PW</AvatarFallback>
    </Avatar>
  );
};
