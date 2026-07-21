import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://henlocal.com"),
  title: "很 Local 实时翻译 — Mac 本地实时翻译",
  description:
    "为会议和现场活动提供实时双语字幕与语音同传，翻译在 Mac 本地私密完成，并可通过蓝牙耳机或现场音响实时播报。",
  applicationName: "很 Local 实时翻译",
  keywords: [
    "offline translation",
    "live subtitles",
    "spoken interpretation",
    "会议同传",
    "语音同传",
    "实时字幕",
    "macOS translator",
    "on-device AI",
    "bilingual subtitles",
    "很 Local",
    "很 Local 实时翻译",
  ],
  openGraph: {
    type: "website",
    url: "https://henlocal.com",
    siteName: "很 Local",
    title: "跨语言会议，让每个人都听得懂、跟得上。",
    description: "面向会议的实时双语字幕与语音同传，识别与翻译在 Mac 本地完成。",
  },
  twitter: {
    card: "summary",
    title: "跨语言会议，让每个人都听得懂、跟得上。",
    description: "面向会议的实时双语字幕与语音同传，识别与翻译在 Mac 本地完成。",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png?v=20260721" />
      </head>
      <body>{children}</body>
    </html>
  );
}
