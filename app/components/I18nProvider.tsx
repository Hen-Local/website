"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { useEffect } from "react";
import { localeStorageKey, type Locale } from "../../i18n/routing";

export default function I18nProvider({ locale, messages, children }: {
  locale: Locale;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}) {
  useEffect(() => {
    try { localStorage.setItem(localeStorageKey, locale); } catch { /* Storage may be disabled. */ }
  }, [locale]);

  return <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">{children}</NextIntlClientProvider>;
}
