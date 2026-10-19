import type { Metadata, Viewport } from "next";
import "./globals.css";

// Register before the router's module scripts. On GitHub Pages, Vinext's
// popstate handler refetches RSC for native anchors, then falls back to the
// same hash and loops. Same-document history should stay with the browser.
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

export const metadata: Metadata = {
  metadataBase: new URL("https://henlocal.com"),
  title: "很 Local 实时翻译 — 在你自己的 Mac 上完成",
  description:
    "会议音频不上传，无需购买专用设备。模型安装完成后，在现有 Apple 芯片 Mac 上离线完成实时识别、翻译、双语字幕与语音播报。",
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
    title: "会议实时翻译，在你自己的 Mac 上完成。",
    description: "音频不上传，模型安装完成后可离线运行，无需购买专用翻译设备。",
  },
  twitter: {
    card: "summary",
    title: "会议实时翻译，在你自己的 Mac 上完成。",
    description: "音频不上传，模型安装完成后可离线运行，无需购买专用翻译设备。",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <script id="static-page-navigation" dangerouslySetInnerHTML={{ __html: staticNavigationScript }} />
        <link rel="icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="shortcut icon" href="/icon.png?v=20260721" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png?v=20260721" />
      </head>
      <body>{children}</body>
    </html>
  );
}
