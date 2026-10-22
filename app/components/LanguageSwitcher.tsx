"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { htmlLanguages, locales, localizedHref, localeStorageKey, type Page } from "../../i18n/routing";

export default function LanguageSwitcher({ page }: { page: Page }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [suffix, setSuffix] = useState({ search: "", hash: "" });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="language-menu" ref={menuRef}>
      <button className="language-trigger" ref={triggerRef} type="button" aria-label={t("languageLabel")} aria-expanded={open} aria-controls="language-options" onClick={() => {
        setSuffix({ search: location.search, hash: location.hash });
        setOpen((value) => !value);
      }}>{t("currentLanguage")}<span aria-hidden="true">⌄</span></button>
      {open && <div className="language-popover" id="language-options" role="group" aria-label={t("languageLabel")}>
        {locales.map((nextLocale) => <a key={nextLocale} href={localizedHref(nextLocale, page, suffix.search, suffix.hash)} lang={htmlLanguages[nextLocale]} hrefLang={htmlLanguages[nextLocale]} aria-current={locale === nextLocale ? "true" : undefined} onClick={() => {
          try { localStorage.setItem(localeStorageKey, nextLocale); } catch { /* Links work without storage. */ }
          setOpen(false);
        }}>{t(`languages.${nextLocale}`)}</a>)}
      </div>}
    </div>
  );
}
