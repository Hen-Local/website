import { htmlLanguages, legacyLocaleRedirectScript, type Locale } from "../../i18n/routing";
import "../globals.css";

const staticNavigationScript = `(() => {
  const pageUrl = location.pathname + location.search;
  window.addEventListener("popstate", (event) => {
    if (location.pathname + location.search !== pageUrl) return;
    event.stopImmediatePropagation();
    history.scrollRestoration = "auto";
  }, true);
  window.addEventListener("pageshow", () => {
    history.scrollRestoration = "auto";
  });
})();`;

export default function RootDocument({ children, locale, legacy = false }: Readonly<{ children: React.ReactNode; locale: Locale; legacy?: boolean }>) {
  return (
    <html lang={htmlLanguages[locale]}>
      <head>
        {locale === "en" && <link rel="preload" href="/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
        {legacy && <script id="legacy-locale-redirect" dangerouslySetInnerHTML={{ __html: legacyLocaleRedirectScript }} />}
        <script id="static-page-navigation" dangerouslySetInnerHTML={{ __html: staticNavigationScript }} />
        <link rel="icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png?v=20260721" />
      </head>
      <body>{children}</body>
    </html>
  );
}
