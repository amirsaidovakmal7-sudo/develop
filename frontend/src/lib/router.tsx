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
import { normalizePath, parsePath, pathFor, SERVICE_PAGES, type Locale, type PageId } from './routes';

export { PATHS, type PageId } from './routes';

export type RouteId = PageId | 'notFound';

/** Pages that render the request form, so "Обсудить проект" can scroll instead of navigating. */
const PAGES_WITH_FORM: RouteId[] = ['home', 'contacts', ...SERVICE_PAGES];
export const REQUEST_ANCHOR = 'request';

type RouterValue = {
  route: RouteId;
  locale: Locale;
  path: string;
  navigate: (to: string) => void;
  /** Localized address of a page in the current (or given) language. */
  href: (page: PageId, locale?: Locale) => string;
};

const RouterContext = createContext<RouterValue | null>(null);

function scrollToHash(hash: string) {
  const el = hash ? document.getElementById(hash) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  else window.scrollTo({ top: 0 });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const pendingHash = useRef(window.location.hash.slice(1));

  useEffect(() => {
    const onPop = () => {
      pendingHash.current = window.location.hash.slice(1);
      setPath(normalizePath(window.location.pathname));
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
    const nextPath = normalizePath(url.pathname);
    const hash = url.hash.slice(1);
    if (nextPath === normalizePath(window.location.pathname)) {
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

  const value = useMemo(() => {
    const { locale, page } = parsePath(path);
    return {
      route: page ?? 'notFound',
      locale,
      path,
      navigate,
      href: (target: PageId, other?: Locale) => pathFor(target, other ?? locale),
    } satisfies RouterValue;
  }, [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a RouterProvider');
  return ctx;
}

/** Where a "discuss a project" CTA should lead from the current page. */
export function useRequestHref() {
  const { route, path, href } = useRouter();
  return PAGES_WITH_FORM.includes(route) ? `${path}#${REQUEST_ANCHOR}` : `${href('contacts')}#${REQUEST_ANCHOR}`;
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
