import { useTranslation } from './i18n';
import { useRouter, type RouteId } from './lib/router';
import { DocumentMeta } from './components/DocumentMeta';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServicePage } from './pages/ServicePage';
import { Projects } from './pages/Projects';
import { Contacts } from './pages/Contacts';
import { NotFound } from './pages/NotFound';

const PAGES: Record<RouteId, () => React.JSX.Element> = {
  home: Home,
  about: About,
  services: Services,
  websites: () => <ServicePage id="websites" />,
  telegramBots: () => <ServicePage id="telegramBots" />,
  miniApp: () => <ServicePage id="miniApp" />,
  crm: () => <ServicePage id="crm" />,
  projects: Projects,
  contacts: Contacts,
  notFound: NotFound,
};

export default function App() {
  const { t, locale } = useTranslation();
  const { route } = useRouter();
  const Page = PAGES[route];

  return (
    <>
      <DocumentMeta />
      <a href="#main" className="skip-link">
        {t.common.skip}
      </a>
      <Header />
      {/* Keyed by language too, so a language switch remounts the page exactly like a page change. */}
      <main id="main" key={`${locale}:${route}`} className="page">
        <Page />
      </main>
      <Footer />
    </>
  );
}
