"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { localizedHref } from "../../i18n/routing";
import SpotIllustration from "./SpotIllustration";
import LanguageSwitcher from "./LanguageSwitcher";
import { createInquiryPayload, hasSavedInquiry } from "../contact/inquiry";
import macBeta from "../data/mac-beta.json";

const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim()
  || "https://forms.pitun.cc/api/inquiries";

export default function ContactPage() {
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "too-long">("idle");
  const t = useTranslations("contact");
  const common = useTranslations("common");
  const homeHref = localizedHref(locale);
  const downloadLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (status === "success") downloadLink.current?.focus();
  }, [status]);

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
      if (!await hasSavedInquiry(response)) throw new Error("Survey was not saved");
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus(error instanceof RangeError ? "too-long" : "error");
    }
  }

  const statusText = status === "error" ? t("error") : status === "too-long" ? t("messageTooLong") : "";

  return (
    <main className="contact-page" data-locale={locale}>
      <header className="contact-header">
        <a className="brand" href={homeHref} aria-label={t("back")}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{common("brandName")}</strong><small>{common("productName")}</small></span>
        </a>
        <div className="header-actions">
          <a className="back-link" href={homeHref}>← {t("back")}</a>
          <LanguageSwitcher page="contact" />
        </div>
      </header>

      <section className="contact-intro">
        <div>
          <h1 id="survey-title">{status === "success" ? t("success") : t("title")}</h1>
          {status !== "success" && <p>{common("surveyNote")}</p>}
        </div>
        <aside><strong>{t("replyTitle")}</strong><span>{common("macRequirements")}</span></aside>
      </section>

      <section className="contact-content">
        <aside className="inquiry-guide">
          <SpotIllustration name="consultation-planning" className="inquiry-illustration" />
          {status !== "success" && <p>{t("privacy")}</p>}
        </aside>

        {status === "success" ? (
          <div className="inquiry-form survey-download">
            <a ref={downloadLink} aria-describedby="survey-title beta-details" className="button button-primary" href={macBeta.url}>{common("downloadBeta")}</a>
            <p id="beta-details">v{macBeta.version} · {t("installerNote")}</p>
          </div>
        ) : <form className="inquiry-form" onSubmit={submitInquiry} aria-busy={status === "sending"}>
          <input className="honeypot" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          <div className="form-grid">
            <label className="half-field"><span>{t("fields.name")} *</span><input name="name" required maxLength={120} autoComplete="name" /></label>
            <label className="half-field"><span>{t("fields.email")} *</span><input type="email" name="email" required maxLength={254} autoComplete="email" /></label>
            <label className="full-field"><span>{t("fields.organization")} *</span><input name="organization" required maxLength={180} autoComplete="organization" aria-describedby="organization-hint" /><small className="field-hint" id="organization-hint">{t("organizationHint")}</small></label>
            <label className="full-field"><span>{t("fields.message")} *</span><textarea name="message" required rows={4} maxLength={2000} placeholder={t("placeholders.message")} /></label>
          </div>
          <label className="consent-field"><input type="checkbox" name="consent" required /><span>{t("fields.consent")} *</span></label>
          <div className="submit-row"><button type="submit" disabled={status === "sending"}>{status === "sending" ? t("sending") : t("submit")}<span aria-hidden="true">→</span></button>{statusText && <p role="status" className={`form-status status-${status === "too-long" ? "error" : status}`}>{statusText}</p>}</div>
        </form>}
      </section>
    </main>
  );
}
