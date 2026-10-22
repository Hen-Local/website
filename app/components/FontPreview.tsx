"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- native document links work on the static host without RSC requests */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { fontOptions, fontPreviewPath, getPreviewFont, isPreviewFont } from "./font-options";
import { updateFontPreviewQuery, useFontPreviewQuery } from "./use-font-preview-query";
import "./font-preview.css";

function subscribeNarrow(callback: () => void) {
  const media = matchMedia("(max-width: 700px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export default function FontPreview() {
  const t = useTranslations("home");
  const query = useFontPreviewQuery();
  const font = getPreviewFont(query.get("font"));
  const compare = query.get("view") === "compare";
  const narrow = useSyncExternalStore(subscribeNarrow, () => matchMedia("(max-width: 700px)").matches, () => false);
  const [chosenDevice, setChosenDevice] = useState<"desktop" | "mobile" | null>(null);
  const device = chosenDevice ?? (narrow ? "mobile" : "desktop");
  const [availableWidth, setAvailableWidth] = useState(1120);
  const [appliedFont, setAppliedFont] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(font.id);

  useEffect(() => {
    selectedRef.current = font.id;
    frameRef.current?.contentWindow?.postMessage({ type: "henlocal:preview-font", font: font.id }, location.origin);
  }, [font.id, compare]);

  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(entry.contentRect.width));
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, [compare]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === "henlocal:font-canvas-ready") {
        frameRef.current?.contentWindow?.postMessage({ type: "henlocal:preview-font", font: selectedRef.current }, location.origin);
      }
      if (event.data?.type === "henlocal:preview-font-applied" && isPreviewFont(event.data.font)) { setAppliedFont(event.data.font); setLoadError(false); }
      if (event.data?.type === "henlocal:preview-font-error") setLoadError(true);
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  const nativeWidth = device === "mobile" ? 390 : 1440;
  const nativeHeight = device === "mobile" ? 844 : 900;
  const scale = Math.min(1, availableWidth / nativeWidth);

  return <main className="font-study">
    <header className="font-study-header"><a href="/en/">← HEN LOCAL</a><span>ENGLISH TYPOGRAPHY / 01</span><a href={`${fontPreviewPath}canvas/?font=${font.id}`} target="_blank" rel="noreferrer">Open full preview ↗</a></header>
    <section className="font-study-intro"><span className="story-label">A TYPE STUDY</span><h1>Find the right voice.</h1><p>Four directions for the English website. Compare the same copy, sizes and spacing, then try each on the actual page.</p></section>

    <div className="font-study-options" role="group" aria-label="English font options">
      {fontOptions.slice(0, 4).map((option, index) => <button className="font-study-option" type="button" key={option.id} aria-pressed={font.id === option.id} onClick={() => updateFontPreviewQuery({ font: option.id })}>
        <span className="font-study-option-meta"><span>0{index + 1}</span>{option.id === "manrope" && <span className="font-study-pick">CURRENT</span>}<span className="font-study-radio" aria-hidden="true">{font.id === option.id ? "●" : "○"}</span></span>
        <strong style={{ fontFamily: option.family }}>{option.name}</strong><span>{option.character}</span>
        <span className="font-study-mini" style={{ fontFamily: option.family }}>Good ideas, shared.</span>
      </button>)}
    </div>

    <div className="font-study-toolbar">
      <div className="font-study-modes" role="group" aria-label="Preview mode"><button type="button" aria-pressed={!compare} onClick={() => updateFontPreviewQuery({ view: "page" })}>Live page</button><button type="button" aria-pressed={compare} onClick={() => updateFontPreviewQuery({ view: "compare" })}>Compare all</button></div>
      <button className="font-study-baseline" type="button" aria-pressed={font.id === "arial"} onClick={() => updateFontPreviewQuery({ font: "arial", view: "page" })}>Previous: Arial</button>
      {!compare && <div className="font-study-modes" role="group" aria-label="Preview screen size"><button type="button" aria-pressed={device === "desktop"} onClick={() => setChosenDevice("desktop")}>Desktop</button><button type="button" aria-pressed={device === "mobile"} onClick={() => setChosenDevice("mobile")}>Mobile</button></div>}
    </div>

    {compare ? <section className="font-study-comparison" aria-label="Font comparison at equal sizes">
      {fontOptions.slice(0, 4).map((option, index) => <article className="font-study-specimen" key={option.id}>
        <div className="font-study-specimen-heading"><span>0{index + 1} / {option.name}</span><button type="button" onClick={() => updateFontPreviewQuery({ font: option.id, view: "page" })}>Try on page ↗</button></div>
        <div className="font-study-specimen-copy" style={{ fontFamily: option.family }}><span>{t("edition")}</span><h2>{t("hero.0")}<br /><em>{t("hero.1")}</em></h2><p>{t("lede")}</p><div className="font-study-specimen-button">{t("contactLink")} <span>↗</span></div><h3>{t("howTitle")}</h3><p className="font-study-glyphs">Aa Bb Gg Rr &amp; 0123456789</p></div>
      </article>)}
    </section> : <section className="font-study-live" aria-label="Live homepage font preview">
      <div className="font-study-live-caption"><div><strong>{font.name}</strong><span>{font.description}</span></div><span className="font-study-ready" role="status">{loadError ? "Font could not load. Refresh to retry." : appliedFont === font.id ? `${nativeWidth} px · Ready` : "Loading preview…"}</span></div>
      <div className="font-study-stage"><div className="font-study-frame-observer" ref={stageRef}><div className="font-study-frame-box" style={{ width: nativeWidth * scale, height: nativeHeight * scale }}>
        <iframe ref={frameRef} src={`${fontPreviewPath}canvas/?embed=1`} title={`English homepage in ${font.name}`} style={{ width: nativeWidth, height: nativeHeight, transform: `scale(${scale})` }} onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: "henlocal:preview-font", font: selectedRef.current }, location.origin)} />
      </div></div></div>
      <p className="font-study-hint">Scroll inside the preview to inspect the rest of the page. Use “Open full preview” to see it at your browser’s full size.</p>
    </section>}

    <footer className="font-study-footer"><span>Manrope is the current English font. Try other options here.</span><div>{fontOptions.slice(0, 4).map((option) => <a key={option.id} href={option.source!} target="_blank" rel="noreferrer">{option.name} ↗</a>)}</div></footer>
  </main>;
}
