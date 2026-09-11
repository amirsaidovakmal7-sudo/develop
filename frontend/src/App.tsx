import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { DocumentMeta } from './components/DocumentMeta';
import { Header } from './components/Header/Header';
import { TelegramCTA } from './components/TelegramCTA/TelegramCTA';
import { Hero } from './sections/Hero/Hero';
import { About } from './sections/About/About';
import { Stack } from './sections/Stack/Stack';
import { Services } from './sections/Services/Services';
import { Projects } from './sections/Projects/Projects';
import { Process } from './sections/Process/Process';
import { Contact } from './sections/Contact/Contact';
import { Footer } from './sections/Footer/Footer';
import { useTranslation } from './i18n';

function App() {
  const { t } = useTranslation();

  return (
    <>
      <DocumentMeta />
      <CustomCursor />
      <a href="#main-content" className="skip-link">
        {t.common.skipToContent}
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Stack />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
      <TelegramCTA />
    </>
  );
}

export default App;
