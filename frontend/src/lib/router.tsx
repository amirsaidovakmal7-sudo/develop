import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

export type PageId = 'home' | 'about' | 'services' | 'projects' | 'contacts';
export type RouteId = PageId | 'notFound';

export const PATHS: Record<PageId, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  projects: '/projects',
  contacts: '/contacts',
};

/** Pages that render the request form, so "Обсудить проект" can scroll instead of navigating. */
const PAGES_WITH_FORM: RouteId[] = ['home', 'contacts'];
export const REQUEST_ANCHOR = 'request';

function normalize(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function matchRoute(pathname: string): RouteId {
  const path = normalize(pathname);
  const found = (Object.keys(PATHS) as PageId[]).find((id) => PATHS[id] === path);
  return found ?? 'notFound';
}

type RouterValue = {
  route: RouteId;
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function scrollToHash(hash: string) {
  const el = hash ? document.getElementById(hash) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0 });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalize(window.location.pathname));
  const pendingHash = useRef(window.location.hash.slice(1));

  useEffect(() => {
    const onPop = () => {
      pendingHash.current = window.location.hash.slice(1);
      setPath(normalize(window.location.pathname));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Runs after the new page has rendered, so the anchor it points at exists.
  useLayoutEffect(() => {
    const hash = pendingHash.current;
    pendingHash.current = '';
    if (hash) requestAnimationFrame(() => scrollToHash(hash));
  }, [path]);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    const nextPath = normalize(url.pathname);
    const hash = url.hash.slice(1);
    if (nextPath === normalize(window.location.pathname)) {
      if (hash) {
        window.history.replaceState(null, '', nextPath + url.hash);
        scrollToHash(hash);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    window.history.pushState(null, '', nextPath + url.hash);
    if (!hash) window.scrollTo({ top: 0 });
    pendingHash.current = hash;
    setPath(nextPath);
  }, []);

  const value = useMemo(() => ({ route: matchRoute(path), path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider');
  return ctx;
}

/** Where a "discuss a project" CTA should lead from the current page. */
export function useRequestHref() {
  const { route, path } = useRouter();
  return PAGES_WITH_FORM.includes(route) ? `${path}#${REQUEST_ANCHOR}` : `${PATHS.contacts}#${REQUEST_ANCHOR}`;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}
