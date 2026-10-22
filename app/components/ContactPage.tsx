"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import { type FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localizedHref } from "../../i18n/routing";
import SpotIllustration from "./SpotIllustration";
import LanguageSwitcher from "./LanguageSwitcher";
import { createInquiryPayload } from "../contact/inquiry";

const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim()
  || "https://forms.pitun.cc/api/inquiries";

export default function ContactPage() {
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "too-long">("idle");
  const t = useTranslations("contact");
  const homeHref = localizedHref(locale);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus("sending");
    try {
      const payload = createInquiryPayload(new FormData(form), locale);
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus(error instanceof RangeError ? "too-long" : "error");
    }
  }

  const statusText = status === "sending" ? t("sending") : status === "success" ? t("success") : status === "error" ? t("error") : status === "too-long" ? t("messageTooLong") : "";

  return (
    <main className="contact-page" data-locale={locale}>
      <header className="contact-header">
        <a className="brand" href={homeHref} aria-label={t("back")}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{t("brand")}</strong><small>{t("product")}</small></span>
        </a>
        <div className="header-actions">
          <a className="back-link" href={homeHref}>← {t("back")}</a>
          <LanguageSwitcher page="contact" />
        </div>
      </header>

      <section className="contact-intro">
        <div><span className="section-tag">{t("eyebrow")}</span><h1>{t("title")}</h1><p>{t("intro")}</p></div>
        <aside><strong>{t("replyTitle")}</strong><span>{t("replyCopy")}</span></aside>
      </section>

      <section className="contact-content">
        <aside className="inquiry-guide">
          <SpotIllustration name="consultation-planning" className="inquiry-illustration" />
          <h2>{t("guideTitle")}</h2>
          <div className="inquiry-guide-copy">{t("guideCopy")}</div>
          <p>{t("privacy")}</p>
        </aside>

        <form className="inquiry-form" onSubmit={submitInquiry}>
          <input className="honeypot" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          <div className="form-grid">
            <label className="half-field"><span>{t("fields.name")} *</span><input name="name" required maxLength={120} autoComplete="name" /></label>
            <label className="half-field"><span>{t("fields.email")} *</span><input type="email" name="email" required maxLength={254} autoComplete="email" /></label>
            <label className="full-field"><span>{t("fields.organization")} *</span><input name="organization" required maxLength={180} autoComplete="organization" /></label>
            <label className="full-field"><span>{t("fields.message")} *</span><textarea name="message" required rows={8} maxLength={2000} aria-describedby="needs-hint" placeholder={t("placeholders.message")} /><small className="field-hint" id="needs-hint">{t("needsHint")}</small></label>
          </div>
          <label className="consent-field"><input type="checkbox" name="consent" required /><span>{t("fields.consent")} *</span></label>
          <div className="submit-row"><button type="submit" disabled={status === "sending"}>{status === "sending" ? t("sending") : t("submit")}<span aria-hidden="true">→</span></button>{statusText && <p role="status" className={`form-status status-${status === "too-long" ? "error" : status}`}>{statusText}</p>}</div>
        </form>
      </section>
    </main>
  );
}
