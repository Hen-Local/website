export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
export const localeStorageKey = "hen-local-locale";
export type Page = "home" | "contact";

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localizedHref(locale: Locale, page: Page = "home", search = "", hash = "") {
  const query = new URLSearchParams(search);
  query.delete("lang");
  const suffix = query.toString();
  return `/${locale}/${page === "contact" ? "contact/" : ""}${suffix ? `?${suffix}` : ""}${hash}`;
}

export const htmlLanguages: Record<Locale, string> = { zh: "zh-CN", en: "en" };

// GitHub Pages has no middleware. Resolve old links before the body is painted;
// actual locale URLs always render their own language without client detection.
export const legacyLocaleRedirectScript = String.raw`(() => {
  const supported = ${JSON.stringify(locales)};
  const query = new URLSearchParams(location.search);
  const requested = query.get("lang");
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(localeStorageKey)}); } catch {}
  const preferred = (navigator.languages || [navigator.language]).map((value) => value.toLowerCase().split("-")[0]).find((value) => supported.includes(value));
  const locale = supported.includes(requested) ? requested : supported.includes(saved) ? saved : preferred || ${JSON.stringify(defaultLocale)};
  query.delete("lang");
  const search = query.toString();
  const page = location.pathname.replace(/\/+$/, "") === "/contact" ? "contact/" : "";
  location.replace("/" + locale + "/" + page + (search ? "?" + search : "") + location.hash);
})();`;
