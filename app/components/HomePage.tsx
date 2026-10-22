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

const navHrefs = ["#how-it-works", "#projects", "#why-local", "#use-cases", "#cost"] as const;

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const eventT = useTranslations("events");
  const homeMessages = useMessages().home;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const contactHref = localizedHref(locale, "contact");
  function messageKeys<Key extends "nav" | "localValues" | "useCases" | "costCards" | "faqs">(key: Key) {
    return Object.keys(homeMessages[key]) as Array<keyof Messages["home"][Key] & string>;
  }
  const nav = messageKeys("nav").map((index) => t(`nav.${index}`));
  const localValues = messageKeys("localValues").map((index) => [t(`localValues.${index}.0`), t(`localValues.${index}.1`)] as const);
  const useCases = messageKeys("useCases").map((index) => [t(`useCases.${index}.0`), t(`useCases.${index}.1`), t(`useCases.${index}.2`)] as const);
  const costCards = messageKeys("costCards").map((index) => [t(`costCards.${index}.0`), t(`costCards.${index}.1`), t(`costCards.${index}.2`), t(`costCards.${index}.3`)] as const);
  const faqs = messageKeys("faqs").map((index) => [t(`faqs.${index}.0`), t(`faqs.${index}.1`)] as const);
  const projects = events.map((event) => ({ ...event, name: eventT(`${event.id}.name`), detail: eventT(`${event.id}.detail`), scale: eventT(`${event.id}.scale`), imageAlt: eventT(`${event.id}.imageAlt`) }));

  return (
    <main id="top" data-locale={locale}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t("homeLabel")}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{t("brandName")}</strong><small>{t("productName")}</small></span>
        </a>
        <nav aria-label={t("navLabel")}>
          {nav.map((item, index) => <a href={navHrefs[index]} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href={contactHref}>{t("contactLink")}</a>
          <LanguageSwitcher page="home" />
        </div>
      </header>

      <section className="hero" id="product" aria-labelledby="product-title">
        <div className="hero-copy">
          <div className="eyebrow-row"><span className="pill"><i /> {t("edition")}</span></div>
          <h1 className="hero-title" id="product-title">{t("hero.0")}<br /><em>{t("hero.1")}</em></h1>
          <p className="hero-lede">{t("lede")}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={contactHref}>{t("contactLink")} <span aria-hidden="true">↗</span></a>
            <a className="button button-light" href="#how-it-works">{t("seeHow")} <span aria-hidden="true">↓</span></a>
          </div>
          <p className="requirements">{t("requirements")}</p>
        </div>

        <div className="product-stage" aria-label={t("previewLabel")}>
          <div className="stage-accent" />
          <div className="app-window">
            <div className="window-bar">
              <div className="window-brand"><img src="/logo-mark.png" width="1024" height="1024" alt="" /><div><strong>{t("brandName")}</strong><span>{t("productName")}</span></div></div>
              <span className="ready"><i /> {t("app.ready")}</span>
            </div>
            <div className="route-label">01&nbsp;&nbsp; {t("app.route")}</div>
            <div className="language-route">
              <div><span>{t("app.source")}</span><strong>{t("app.sourceValue")}</strong></div><b aria-hidden="true">⇄</b><div><span>{t("app.target")}</span><strong>{t("app.targetValue")}</strong></div>
            </div>
            <div className="waveform" aria-hidden="true">{[14,24,38,18,31,52,26,60,35,20,44,29,54,34,18,42,25,48,16].map((height, index) => <i key={index} style={{ height }} />)}</div>
            <div className="launch-row"><span>{t("app.input")}</span><strong>{t("app.start")}&nbsp; →</strong></div>
          </div>
          <div className="subtitle-card">
            <div className="subtitle-topline"><span><i /> {t("app.live")}</span><span>EN → 中文</span></div>
            <p>{t("app.sampleSource")}</p><strong>{t("app.sampleTarget")}</strong>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow-intro">
          <span className="story-label">{t("howTag")}</span>
          <h2 id="workflow-title">{t("howTitle")}</h2>
        </div>
        <WorkflowDiagram locale={locale} labels={{ diagramLabel: t("diagramLabel") }} />
      </section>

      <ProjectCarousel projects={projects} />

      <section className="privacy-section" id="why-local">
        <div className="privacy-heading"><span className="story-label">{t("whyTag")}</span><h2>{t("privacyTitle.0")}<br />{t("privacyTitle.1")}</h2></div>
        <p className="privacy-summary">{t("privacyCopy")}</p>
        <div className="local-value-list">{localValues.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{copy}</p></div>)}</div>
        <SpotIllustration name="privacy-local" className="privacy-illustration" />
      </section>

      <section className="use-cases-section" id="use-cases">
        <div className="use-cases-heading">
          <span className="story-label">{t("useCasesTag")}</span>
          <div><h2>{t("useCasesTitle.0")}<br />{t("useCasesTitle.1")}</h2><p>{t("useCasesIntro")}</p></div>
        </div>
        <div className="use-case-grid">
          {useCases.map(([title, copy, meta], index) => <article key={title}>
            <div className="use-case-heading"><div className="use-case-meta"><span>0{index + 1}</span><small>{meta}</small></div><h3>{title}</h3></div>
            <SpotIllustration name={sceneIllustrations[index]} className="use-case-illustration" />
            <p>{copy}</p>
          </article>)}
        </div>
      </section>

      <section className="cost-section" id="cost">
        <div className="cost-heading"><span className="story-label">{t("costTag")}</span><div><h2>{t("costTitle.0")}<br />{t("costTitle.1")}</h2><p>{t("costIntro")}</p></div><SpotIllustration name="cost-multiple-meetings" className="cost-illustration" /></div>
        <div className="cost-grid">{costCards.map(([name, price, unit, copy], index) => <article className={index === 0 ? "cost-local" : ""} key={name}><span>0{index + 1}</span><h3>{name}</h3><strong>{price}</strong><b>{unit}</b><p>{copy}</p></article>)}</div>
        <div className="cost-evidence">
          <div><strong>{t("costSourceLabel")}</strong><p>{t("costDisclaimer")}</p></div>
          <div className="source-links"><a href="https://tongchuan.iflyrec.com/recharge.html" target="_blank" rel="noreferrer">讯飞同传 ↗</a><a href="https://maestra.ai/pricing?type=real-time" target="_blank" rel="noreferrer">Maestra ↗</a></div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading"><span className="story-label">{t("faqTag")}</span><h2>{t("faqTitle")}</h2></div>
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
        <div><span className="section-tag">{t("commercialTag")}</span><h2>{t("commercialTitle.0")}<br />{t("commercialTitle.1")}</h2><p>{t("commercialCopy")}</p></div>
        <div className="access-actions"><span className="commercial-note">{t("commercialNote")}</span><a className="button button-accent" href={contactHref}>{t("contactCta")} <span aria-hidden="true">↗</span></a></div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span><span className="brand-copy"><strong>{t("brandName")}</strong><small>{t("productName")}</small></span></a>
        <p>{t("footerLine")}</p>
        <div><a href="#why-local">{t("footerLinks.0")}</a><a href="#how-it-works">{t("footerLinks.1")}</a><a href="#use-cases">{t("footerLinks.2")}</a><a href="#cost">{t("footerLinks.3")}</a><a href={contactHref}>{t("footerLinks.4")}</a></div>
        <small>© {new Date().getFullYear()} {t("brandName")}</small>
      </footer>
    </main>
  );
}
