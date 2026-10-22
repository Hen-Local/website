import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FontCanvas from "../../../../components/FontCanvas";

export const metadata: Metadata = { title: "Contact font preview — HEN LOCAL", robots: { index: false, follow: false } };
export function generateStaticParams() { return [{ locale: "en" }]; }

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <FontCanvas page="contact" />;
}
