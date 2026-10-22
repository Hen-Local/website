"use client";

import { type MouseEvent, useEffect, useState } from "react";
import HomePage from "./HomePage";
import ContactPage from "./ContactPage";
import { fontPreviewPath, getPreviewFont, isPreviewFont, type PreviewFontId } from "./font-options";
import { useFontPreviewQuery } from "./use-font-preview-query";
import "./font-preview.css";

export default function FontCanvas({ page = "home" }: { page?: "home" | "contact" }) {
  const query = useFontPreviewQuery();
  const [messageFont, setMessageFont] = useState<PreviewFontId | null>(null);
  const font = getPreviewFont(messageFont ?? query.get("font"));
  const embedded = query.get("embed") === "1";

  useEffect(() => {
    if (window.parent === window) return;
    function receive(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== window.parent) return;
      if (event.data?.type === "henlocal:preview-font" && isPreviewFont(event.data.font)) setMessageFont(event.data.font);
    }
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "henlocal:font-canvas-ready" }, location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([document.fonts.load(`400 16px "${font.face}"`), document.fonts.load(`650 40px "${font.face}"`)]).then(() => {
      if (!cancelled && window.parent !== window) window.parent.postMessage({ type: "henlocal:preview-font-applied", font: font.id }, location.origin);
    }).catch(() => {
      if (!cancelled && window.parent !== window) window.parent.postMessage({ type: "henlocal:preview-font-error", font: font.id }, location.origin);
    });
    return () => { cancelled = true; };
  }, [font]);

  function keepPreviewFont(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest("a");
    if (!link || link.target || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !["/en/", "/en/contact/"].includes(url.pathname)) return;
    event.preventDefault();
    const destination = `${fontPreviewPath}canvas/${url.pathname === "/en/contact/" ? "contact/" : ""}`;
    const params = new URLSearchParams({ font: font.id });
    if (embedded) params.set("embed", "1");
    location.assign(`${destination}?${params}${url.hash}`);
  }

  return <div className="font-canvas" data-preview-font={font.id}>
    {!embedded && <div className="font-canvas-bar"><a href={`${fontPreviewPath}?font=${font.id}`}>← Font options</a><span>{font.name} <small>Preview</small></span></div>}
    <div style={{ fontFamily: font.family }} onClickCapture={keepPreviewFont}>{page === "contact" ? <ContactPage /> : <HomePage />}</div>
  </div>;
}
