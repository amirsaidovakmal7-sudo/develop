import { useTranslation } from './i18n';
import { useRouter, type RouteId } from './lib/router';
import { DocumentMeta } from './components/DocumentMeta';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { Contacts } from './pages/Contacts';
import { NotFound } from './pages/NotFound';

const PAGES: Record<RouteId, () => React.JSX.Element> = {
  home: Home,
  about: About,
  services: Services,
  projects: Projects,
  contacts: Contacts,
  notFound: NotFound,
};

export default function App() {
  const { t } = useTranslation();
  const { route } = useRouter();
  const Page = PAGES[route];

  return (
    <>
      <DocumentMeta />
      <a href="#main" className="skip-link">
        {t.common.skip}
      </a>
      <Header />
      <main id="main" key={route} className="page">
        <Page />
      </main>
      <Footer />
    </>
  );
}
