import type { Metadata } from "next";
import { getMessages } from "./messages";
import { localizedHref, type Locale, type Page } from "./routing";

export function pageMetadata(locale: Locale, page: Page = "home"): Metadata {
  const { seo, home } = getMessages(locale);
  const title = page === "home" ? seo.homeTitle : seo.contactTitle;
  const description = page === "home" ? seo.homeDescription : seo.contactDescription;
  return {
    metadataBase: new URL("https://henlocal.com"),
    title,
    description,
    applicationName: `${home.brandName} ${home.productName}`,
    keywords: ["offline translation", "live subtitles", "spoken interpretation", "会议同传", "语音同传", "实时字幕", "macOS translator", "on-device AI", "bilingual subtitles", "很 Local", "很 Local 实时翻译"],
    alternates: {
      canonical: localizedHref(locale, page),
      languages: { "zh-CN": localizedHref("zh", page), en: localizedHref("en", page), "x-default": page === "home" ? "/" : "/contact/" },
    },
    openGraph: {
      type: "website",
      url: localizedHref(locale, page),
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      siteName: home.brandName,
      title,
      description,
    },
    twitter: { card: "summary", title, description },
  };
}
