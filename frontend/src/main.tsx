import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n';
import { RouterProvider } from './lib/router';
import './styles/global.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </RouterProvider>
  </StrictMode>,
);
