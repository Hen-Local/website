import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "获取本地部署建议 — 很 Local 实时翻译",
  description: "提交现有 Mac 配置、会议规模、音频条件与语言方向，获取很 Local 实时翻译的本地部署建议。",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
