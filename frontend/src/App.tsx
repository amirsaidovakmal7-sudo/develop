import { DocumentMeta } from './components/DocumentMeta';
import { Armature } from './components/Armature/Armature';
import { Header } from './components/Header/Header';
import { GirihField } from './scenes/GirihField/GirihField';
import { Hero } from './sections/Hero/Hero';
import { Work } from './sections/Work/Work';
import { Approach } from './sections/Approach/Approach';
import { Build } from './sections/Build/Build';
import { Process } from './sections/Process/Process';
import { Terms } from './sections/Terms/Terms';
import { Contact } from './sections/Contact/Contact';
import { Footer } from './sections/Footer/Footer';
import { useTranslation } from './i18n';

/**
 * Page order is the argument the site makes: the work comes first, because
 * it is the proof; who he is and what he runs comes second; what he builds
 * and how he works follow; the order form closes it.
 *
 * There is deliberately no floating contact button. Telegram is reachable
 * from the mobile menu, the approach section, the contact panel and the
 * footer; a fixed bubble on top of all that added no reach and covered
 * real content at every width it was tried at.
 */
function App() {
  const { t } = useTranslation();

  return (
    <>
      <DocumentMeta />
      <a href="#main-content" className="skip-link">
        {t.common.skipToContent}
      </a>

      <GirihField />
      <Armature />

      <Header />
      <main id="main-content">
        <Hero />
        <Work />
        <Approach />
        <Build />
        <Process />
        <Terms />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
