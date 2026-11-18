import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export interface NextLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string | { pathname?: string; query?: Record<string, string | number> };
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  asChild?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ href, replace, scroll = true, prefetch, asChild, children, onClick, ...props }, ref) => {
    let to = "/";
    if (typeof href === "string") {
      to = href;
    } else if (href && href.pathname) {
      to = href.pathname;
      if (href.query) {
        const params = new URLSearchParams();
        Object.entries(href.query).forEach(([k, v]) => {
          params.set(k, String(v));
        });
        to += `?${params.toString()}`;
      }
    }

    const isExternal =
      to.startsWith("http://") ||
      to.startsWith("https://") ||
      to.startsWith("//") ||
      to.startsWith("mailto:") ||
      to.startsWith("tel:");

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);
      if (scroll && !isExternal && !to.includes("#")) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    if (isExternal) {
      return (
        <a ref={ref} href={to} onClick={handleClick} {...props}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={to} replace={replace} onClick={handleClick} {...props}>
        {children}
      </RouterLink>
    );
  },
);

Link.displayName = "Link";
export default Link;
