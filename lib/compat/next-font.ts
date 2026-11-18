export interface FontOptions {
  subsets?: string[];
  weight?: string | string[];
  display?: string;
  variable?: string;
}

export function Caveat(options?: FontOptions) {
  return {
    className: "font-caveat",
    variable: options?.variable || "--font-caveat",
    style: { fontFamily: "'Caveat', cursive" },
  };
}

export function Plus_Jakarta_Sans(options?: FontOptions) {
  return {
    className: "font-sans",
    variable: options?.variable || "--font-jakarta-plus",
    style: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
  };
}
