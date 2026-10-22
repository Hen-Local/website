import type { Viewport } from "next";
import { getMessages } from "../../i18n/messages";
import { pageMetadata } from "../../i18n/metadata";
import { defaultLocale } from "../../i18n/routing";
import I18nProvider from "../components/I18nProvider";
import RootDocument from "../components/RootDocument";

export const viewport: Viewport = { themeColor: "#ffffff" };
export const metadata = pageMetadata(defaultLocale);

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale={defaultLocale} legacy><I18nProvider locale={defaultLocale} messages={getMessages(defaultLocale)}>{children}</I18nProvider></RootDocument>;
}
