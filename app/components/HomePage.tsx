"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import { useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { localizedHref } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import { events } from "../data/events";
import ProjectCarousel from "./ProjectCarousel";
import WorkflowDiagram from "./WorkflowDiagram";
import SpotIllustration from "./SpotIllustration";
import LanguageSwitcher from "./LanguageSwitcher";

const sceneIllustrations = ["scene-keynote", "scene-workshop", "scene-forum", "scene-hybrid"] as const;

const navHrefs = ["#how-it-works", "#projects", "#why-local", "#use-cases"] as const;

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const common = useTranslations("common");
  const eventT = useTranslations("events");
  const homeMessages = useMessages().home;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const contactHref = localizedHref(locale, "contact");
  function messageKeys<Key extends "nav" | "localValues" | "useCases" | "faqs">(key: Key) {
    return Object.keys(homeMessages[key]) as Array<keyof Messages["home"][Key] & string>;
  }
  const nav = messageKeys("nav").map((index) => t(`nav.${index}`));
  const localValues = messageKeys("localValues").map((index) => [t(`localValues.${index}.0`), t(`localValues.${index}.1`)] as const);
  const useCases = messageKeys("useCases").map((index) => [t(`useCases.${index}.0`), t(`useCases.${index}.1`)] as const);
  const faqs = messageKeys("faqs").map((index) => [t(`faqs.${index}.0`), t(`faqs.${index}.1`)] as const);
  const projects = events.map((event) => ({ ...event, name: eventT(`${event.id}.name`), detail: eventT(`${event.id}.detail`), scale: eventT(`${event.id}.scale`), imageAlt: eventT(`${event.id}.imageAlt`) }));

  return (
    <main id="top" data-locale={locale}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t("homeLabel")}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{common("brandName")}</strong><small>{common("productName")}</small></span>
        </a>
        <nav aria-label={t("navLabel")}>
          {nav.map((item, index) => <a href={navHrefs[index]} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href={contactHref}>{common("downloadBeta")}</a>
          <LanguageSwitcher page="home" />
        </div>
      </header>

      <section className="hero" id="product" aria-labelledby="product-title">
        <div className="hero-copy">
          <div className="eyebrow-row"><span className="pill"><i /> {t("edition")}</span></div>
          <h1 className="hero-title" id="product-title">{t("hero.0")}<br /><em>{t("hero.1")}</em></h1>
          <p className="hero-lede">{t("lede")}</p>
          <p className="beta-invite">{common("surveyNote")}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={contactHref}>{common("downloadBeta")}</a>
            <a className="button button-light" href="#how-it-works">{t("nav.0")} <span aria-hidden="true">↓</span></a>
          </div>
          <p className="requirements">{common("macRequirements")}</p>
        </div>

        <div className="product-stage" aria-label={t("previewLabel")}>
          <div className="stage-accent" />
          <div className="app-window">
            <div className="window-bar">
              <div className="window-brand"><img src="/logo-mark.png" width="1024" height="1024" alt="" /><div><strong>{common("brandName")}</strong><span>{common("productName")}</span></div></div>
              <span className="ready"><i /> {t("app.ready")}</span>
            </div>
            <div className="route-label">{t("app.route")}</div>
            <div className="language-route">
              <div><span>{t("app.source")}</span><strong>{t("app.sourceValue")}</strong></div><b aria-hidden="true">⇄</b><div><span>{t("app.target")}</span><strong>{t("app.targetValue")}</strong></div>
            </div>
            <div className="waveform" aria-hidden="true">{[14,24,38,18,31,52,26,60,35,20,44,29,54,34,18,42,25,48,16].map((height, index) => <i key={index} style={{ height }} />)}</div>
            <div className="launch-row"><span>{t("app.input")}</span><strong>{t("app.start")}&nbsp; →</strong></div>
          </div>
          <div className="subtitle-card">
            <div className="subtitle-topline"><span><i /> {t("app.live")}</span><span>{t("app.sourceValue")} → {t("app.targetValue")}</span></div>
            <p lang="en">{t("app.sampleSource")}</p><strong lang="zh-CN">{t("app.sampleTarget")}</strong>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow-intro">
          <h2 id="workflow-title">{t("nav.0")}</h2>
        </div>
        <WorkflowDiagram locale={locale} labels={{ diagramLabel: t("diagramLabel") }} />
      </section>

      <ProjectCarousel projects={projects} />

      <section className="privacy-section" id="why-local">
        <div className="privacy-heading"><h2>{t("nav.2")}</h2></div>
        <p className="privacy-summary">{t("privacyCopy")}</p>
        <div className="local-value-list">{localValues.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{copy}</p></div>)}</div>
        <SpotIllustration name="privacy-local" className="privacy-illustration" />
      </section>

      <section className="use-cases-section" id="use-cases">
        <div className="use-cases-heading">
          <h2>{t("nav.3")}</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map(([title, copy], index) => <article key={title}>
            <h3>{title}</h3>
            <SpotIllustration name={sceneIllustrations[index]} className="use-case-illustration" />
            <p>{copy}</p>
          </article>)}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading"><h2>{t("faqTitle")}</h2></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <article className={activeFaq === index ? "is-active" : ""} key={question}>
          <button type="button" aria-expanded={activeFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setActiveFaq((current) => current === index ? null : index)}><span>0{index + 1}</span>{question}<b aria-hidden="true">＋</b></button>
          <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={activeFaq !== index}><div className="faq-answer-content">
            <p>{answer}</p>
            {index === 3 && <figure className="faq-hardware"><SpotIllustration name="hardware-connections" alt={t("hardwareAlt")} /></figure>}
          </div></div>
        </article>)}</div>
      </section>

      <section className="access-section">
        <div className="access-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></div>
        <div><h2>{t("commercialTitle")}</h2><p>{common("surveyNote")}</p></div>
        <div className="access-actions"><a className="button button-accent" href={contactHref}>{common("downloadBeta")}</a></div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span><span className="brand-copy"><strong>{common("brandName")}</strong><small>{common("productName")}</small></span></a>
        <div><a href="#why-local">{t("nav.2")}</a><a href="#how-it-works">{t("nav.0")}</a><a href="#use-cases">{t("nav.3")}</a><a href={contactHref}>{common("downloadBeta")}</a></div>
        <small>© {new Date().getFullYear()} {common("brandName")}</small>
      </footer>
    </main>
  );
}
