import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "咨询会议方案 — 很 Local 实时翻译",
  description: "提交会议时间、地点、规模、同时翻译数量与语言方向，获取很 Local 实时翻译的会议方案建议。",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
