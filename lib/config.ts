import {
  PiBriefcaseDuotone,
  PiCircleDuotone,
  PiDatabaseDuotone,
  PiHouseDuotone,
  PiLightningDuotone,
} from "react-icons/pi";

export const siteItems = {
  title: "Piahn Wijaya | Product Engineer",
  appName: "PWIJAYA",
  description:
    "When creativity meets perfection, you get me. A freelance product engineer / fullstack developer with a passion for building pretty products.",
  name: "Piahn Wijaya",
  url: process.env.NEXT_PUBLIC_BASE_URL,
  role: "Fullstack Engineer",
  links: {
    twitter: "https://twitter.com/pwijaya",
    github: "https://github.com/pwijaya",
    email: "pwijaya@gmail.com",
    personalSite: "https://pwijaya.com",
  },
};

export const navItems = [
  {
    id: 1,
    label: "Home",
    href: "/",
    icon: PiHouseDuotone,
  },
  {
    id: 2,
    label: "Archive",
    href: "/archive",
    icon: PiBriefcaseDuotone,
  },
  {
    id: 3,
    label: "Lab",
    href: "/lab",
    icon: PiLightningDuotone,
  },
  {
    id: 4,
    label: "Material",
    href: "/material",
    icon: PiDatabaseDuotone,
  },
  {
    id: 5,
    label: "Theme",
    function: "toggle-theme",
    icon: PiCircleDuotone,
  },
];
