import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "../../i18n/messages";
import { isLocale, locales } from "../../i18n/routing";
import I18nProvider from "../components/I18nProvider";
import RootDocument from "../components/RootDocument";

export const viewport: Viewport = { themeColor: "#ffffff" };
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RootDocument locale={locale}><I18nProvider locale={locale} messages={getMessages(locale)}>{children}</I18nProvider></RootDocument>;
}
