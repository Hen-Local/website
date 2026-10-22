import { notFound } from "next/navigation";
import { pageMetadata } from "../../../i18n/metadata";
import { isLocale, locales } from "../../../i18n/routing";
import ContactPage from "../../components/ContactPage";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(locale, "contact");
}

export default function Page() { return <ContactPage />; }
