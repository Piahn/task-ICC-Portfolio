import {
  useLocation,
  useNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (
      url: string,
      options?: { scroll?: boolean },
    ) => {
      navigate(url);
      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    replace: (
      url: string,
      options?: { scroll?: boolean },
    ) => {
      navigate(url, { replace: true });
      if (options?.scroll !== false) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function useParams() {
  return useRouterParams();
}

export function notFound() {
  throw new Response("Not Found", { status: 404 });
}
