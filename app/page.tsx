"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import { useEffect, useState } from "react";

type Locale = "zh" | "en";

const content = {
  zh: {
    brandName: "很 Local",
    productName: "实时翻译",
    previewLabel: "很 Local 实时翻译界面预览",
    homeLabel: "很 Local 首页",
    navLabel: "主导航",
    nav: ["会议同传", "本地隐私", "成本可控", "快速部署"],
    languageLabel: "语言",
    contactLink: "咨询方案",
    edition: "会议实时翻译",
    platform: "实时字幕与语音同传",
    hero: ["跨语言会议，", "让每个人都听得懂、跟得上。"],
    lede: "很 Local 实时翻译将讲者发言即时转换为双语字幕和目标语言语音。无论是 Keynote、工作坊还是跨国会议，参会者都能同步理解现场内容，识别与翻译全程在 Mac 本地完成。",
    seeHow: "了解会议工作流",
    accessNote: "可通过蓝牙耳机或系统音频，实时听见翻译后的语音播报。",
    requirements: "macOS 14+ · Apple 芯片 Mac · 本地运行",
    app: {
      ready: "本地 AI 已就绪",
      route: "语言与音频",
      source: "源语言",
      target: "目标语言",
      sourceValue: "英语",
      targetValue: "中文",
      input: "会议音频 · 双语字幕 · 语音同传",
      start: "开始会议翻译",
      live: "实时",
      sampleSource: "大家都能看到我的屏幕吗？",
      sampleTarget: "Can everyone see my screen?",
    },
    ticker: ["会议同传", "实时字幕", "语音播报", "蓝牙耳机", "本地处理", "隐私优先", "系统音频", "会议同传"],
    useCasesTag: "优势一 · 实时字幕与语音同传",
    useCasesTitle: ["台上照常讲，", "台下实时看懂、听懂。"],
    useCasesIntro: "讲者无需改变发言方式，参会者可以看双语字幕，也可以通过蓝牙耳机或会场音响收听译文。不同语言的观众，在同一时间理解同一场会议。",
    useCases: [
      ["Keynote 与演讲", "主舞台持续发言时，在大屏显示双语字幕，并把译文播报到耳机或会场音响。", "主舞台 · 一对多"],
      ["工作坊与培训", "参与者需要长时间跟随内容、理解术语并互动，字幕与语音可以同时提供。", "长时内容 · 可互动"],
      ["国际论坛与发布会", "为不同语言的现场观众提供统一的信息入口，也可保留双语记录用于会后整理。", "大型活动 · 可回顾"],
      ["跨国企业会议", "接入会议室麦克风或 Mac 系统音频，让现场与远程参会者同步读到、听到译文。", "会议室 · 混合会议"],
    ],
    fitTitle: "更适合",
    fitCopy: "结构化会议、演讲、培训、发布会，以及需要控制成本和数据边界的长期使用。",
    notFitTitle: "需要人工同传或人工复核",
    notFitCopy: "外交、司法、医疗等高风险场景，或大量抢话、强噪声、必须承担专业译员责任的会议。",
    whyTag: "优势二 · 会议数据不出本机",
    privacyKicker: "本地运行，数据边界更清楚",
    privacyTitle: ["音频不上传，", "转录与译文不出本机。"],
    privacyCopy: "语音识别、翻译和语音生成全部在你的 Mac 上完成。会议音频无需发送到云端，也不会留下云端转录副本或被用于训练其他模型。",
    localValues: [
      ["数据边界清楚", "音频、转录、翻译和语音生成留在本机。"],
      ["现场更稳定", "核心处理不依赖把会议音频持续传到云端。"],
      ["费用更可预测", "会议时长不会继续产生云端转写、翻译和语音播报的按量费用。"],
    ],
    orbit: ["音频", "转录", "翻译"],
    stays: "始终留在本机",
    costTag: "优势三 · 成本可控",
    costTitle: ["会议开得越多，", "越不该被按分钟收费。"],
    costIntro: "多数云端同传会按分钟、小时、字符或语言数量持续计费。很 Local 在你已有的 Apple 芯片 Mac 上完成核心处理，特别适合长时间、多场次和高频使用。",
    costCards: [
      ["很 Local", "本地处理", "会议时长不产生云端用量费", "软件授权、部署支持和现场服务根据会议需求询价。"],
      ["讯飞同传企业版", "¥4,080 / 100 小时起", "约 ¥40.8 / 小时", "500 小时 ¥18,000；1000 小时 ¥33,600。套餐有效期与服务范围以官方页面为准。"],
      ["Maestra 实时翻译", "$79 / 月", "含 180 分钟 / 每种语言", "Business 为 $159/月、含 360 分钟实时翻译或 180 分钟实时配音。"],
    ],
    costSourceLabel: "公开价格参考",
    costDisclaimer: "价格查询于 2026 年 7 月 21 日，仅用于解释计费方式；产品范围、语言、税费、硬件和人工保障并不完全相同，竞品价格可能随时调整。",
    apiPricingTitle: "为什么不直接拿语音 API 单价当作同传价格？",
    apiPricingCopy: "ElevenLabs 公布的实时转写为 $0.39/小时，快速语音合成为 $0.05/千字符；MiniMax 语音合成为 $60–100/百万字符。它们是底层能力价格，不包含完整的实时翻译、会议编排、字幕界面和现场音频输出，因此不能与成品会议方案直接等同。",
    featuresTag: "安静地融入工作",
    featuresTitle: ["让每一位参会者，", "同步理解现场。"],
    featuresIntro: "围绕跨语言会议设计的 Mac 应用，从现场收音到字幕和语音播报，全程无需把会议发送到云端。",
    features: [
      ["会议实时字幕", "通过麦克风或系统音频捕捉现场发言，在会议进行时同步显示源语言与译文。"],
      ["实时语音同传", "将译文实时播报到蓝牙耳机、系统扬声器或指定音频设备，让参会者直接听见译文。"],
      ["本地隐私处理", "语音识别、翻译与语音生成均在 Apple 芯片 Mac 上完成，会议内容不离开设备。"],
      ["会议记录与回顾", "导出或自动保存双语转录，便于会后整理重点，同时无需把录音交给云端。"],
    ],
    howTag: "优势四 · 快速部署",
    howTitle: ["接入会场音频，", "即可开始实时翻译。"],
    howNote: "接入音频 → 选择语言 → 输出字幕与译音",
    workflow: [
      ["接入会议音频", "选择现场麦克风、会议系统或 Mac 系统音频作为输入。"],
      ["本地识别与翻译", "本地 AI 实时识别发言，并生成目标语言译文。"],
      ["字幕与语音输出", "双语字幕显示在悬浮层中，译文同时播报到耳机或系统音频。"],
    ],
    faqTag: "FAQ",
    faqTitle: "常见问题",
    faqs: [
      ["参会者怎样看到或听到译文？", "译文可显示为双语字幕，并通过蓝牙耳机、系统扬声器或指定音频设备实时播报。具体输出方式取决于会场音响和参会人数。"],
      ["为什么一定要在本地运行？", "本地运行把会议内容留在设备内，同时减少持续上传带来的网络风险，并避免核心处理随分钟数不断累积云端用量费。"],
      ["需要准备什么设备？", "至少需要一台运行 macOS 14 或更高版本的 Apple 芯片 Mac，以及可用的麦克风、会议系统或系统音频输入。大型会场建议提前联调音响和耳机链路。"],
      ["它能完全替代专业同传译员吗？", "不能一概而论。结构化会议、培训和一般商务场景适合先评估 AI 同传；高风险、强专业责任或复杂多人对话场景应保留专业译员或人工复核。"],
    ],
    commercialTag: "获取会议方案",
    commercialTitle: ["提交会议信息，", "获取专属部署建议。"],
    commercialCopy: "告诉我们会议日期、规模、语言方向和会场音频条件。我们会评估需要的设备、字幕与语音输出方式，以及同时开启的翻译数量，并通过邮件回复建议方案。",
    commercialNote: "会议地点 · 日期与规模 · 行业 · 语言组合 · 字幕与耳机需求",
    contactCta: "提交需求，获取方案",
    footerLine: "面向会议的本地实时字幕与语音同传",
    footerLinks: ["适用场景", "本地优势", "成本方式", "联系我们"],
  },
  en: {
    brandName: "HEN LOCAL",
    productName: "LIVE TRANSLATOR",
    previewLabel: "HEN LOCAL LIVE TRANSLATOR interface preview",
    homeLabel: "HEN LOCAL home",
    navLabel: "Primary navigation",
    nav: ["INTERPRETATION", "PRIVACY", "COST", "SETUP"],
    languageLabel: "LANGUAGE",
    contactLink: "CONTACT",
    edition: "LIVE MEETING TRANSLATION",
    platform: "LIVE CAPTIONS + VOICE INTERPRETATION",
    hero: ["Real-time translation", "built for live meetings."],
    lede: "HEN LOCAL turns a speaker’s voice into bilingual captions and translated speech in real time. Attendees can follow keynotes, workshops, and global meetings in their preferred language while processing stays on your Mac.",
    seeHow: "SEE THE MEETING WORKFLOW",
    accessNote: "Hear translated speech in real time through Bluetooth headphones or system audio.",
    requirements: "macOS 14+ · Apple silicon · Runs locally",
    app: {
      ready: "LOCAL AI READY",
      route: "LANGUAGE + AUDIO",
      source: "SOURCE",
      target: "TARGET",
      sourceValue: "English",
      targetValue: "中文",
      input: "MEETING AUDIO · CAPTIONS · SPOKEN INTERPRETATION",
      start: "START MEETING",
      live: "LIVE",
      sampleSource: "Can everyone see my screen?",
      sampleTarget: "大家都能看到我的屏幕吗？",
    },
    ticker: ["MEETING INTERPRETATION", "LIVE CAPTIONS", "SPOKEN OUTPUT", "BLUETOOTH AUDIO", "ON-DEVICE", "PRIVATE", "SYSTEM AUDIO", "REAL-TIME"],
    useCasesTag: "ADVANTAGE 01 · LIVE CAPTIONS + INTERPRETATION",
    useCasesTitle: ["The speaker keeps speaking.", "Everyone else keeps up."],
    useCasesIntro: "Speakers focus on speaking. Attendees choose captions or translated audio. HEN LOCAL connects room audio to screens, Bluetooth headphones, and venue sound so everyone can understand the same moment.",
    useCases: [
      ["Keynotes + presentations", "Show bilingual captions on the main screen and route translated speech to headphones or venue audio.", "MAIN STAGE · ONE-TO-MANY"],
      ["Workshops + training", "Help participants follow longer, terminology-heavy, interactive sessions with captions and spoken output together.", "LONG FORM · INTERACTIVE"],
      ["Conferences + launches", "Give multilingual audiences one clear way to follow the event and retain bilingual records for follow-up.", "LARGE EVENTS · REVIEWABLE"],
      ["Global company meetings", "Connect room microphones or Mac system audio so in-person and remote attendees can read and hear the translation.", "MEETING ROOM · HYBRID"],
    ],
    fitTitle: "A STRONG FIT",
    fitCopy: "Structured meetings, presentations, training, launches, and repeated use where privacy and predictable cost matter.",
    notFitTitle: "KEEP A HUMAN INTERPRETER OR REVIEWER",
    notFitCopy: "Diplomatic, legal, or medical events; heavy cross-talk and noise; or meetings requiring professional interpreter accountability.",
    whyTag: "ADVANTAGE 02 · MEETING DATA STAYS LOCAL",
    privacyKicker: "ON-DEVICE PROCESSING WITH A CLEAR DATA BOUNDARY",
    privacyTitle: ["No audio uploads.", "No cloud transcript."],
    privacyCopy: "Speech recognition, translation, and voice generation run on your Mac. Meeting audio does not need to be sent to the cloud, stored as a cloud transcript, or used to train another model.",
    localValues: [
      ["A clear data boundary", "Audio, transcripts, translation, and generated speech stay on the Mac."],
      ["More resilient on site", "Core processing does not depend on continuously streaming meeting audio to the cloud."],
      ["More predictable cost", "Longer sessions do not create additional cloud transcription, translation, and speech-output usage fees."],
    ],
    orbit: ["AUDIO", "TRANSCRIPT", "TRANSLATION"],
    stays: "STAYS HERE",
    costTag: "ADVANTAGE 03 · CONTROL COST",
    costTitle: ["Run more meetings", "without per-minute cloud fees."],
    costIntro: "Cloud interpretation is commonly metered by hour, minute, character, or language. HEN LOCAL moves the core workload to an Apple silicon Mac you control—a better fit for frequent, long, and repeated sessions.",
    costCards: [
      ["HEN LOCAL", "ON-DEVICE PROCESSING", "No cloud usage fee tied to meeting length", "Software licensing, deployment support, and event services are quoted for the actual meeting."],
      ["iFLYREC Enterprise", "FROM ¥4,080 / 100 HOURS", "ABOUT ¥40.8 / HOUR", "¥18,000 for 500 hours and ¥33,600 for 1,000 hours. Term and service scope follow the official offer."],
      ["Maestra Real-Time", "$79 / MONTH", "180 MINUTES / LANGUAGE", "Business is $159/month with 360 minutes of real-time translation or 180 minutes of real-time dubbing."],
    ],
    costSourceLabel: "PUBLIC PRICE REFERENCES",
    costDisclaimer: "Prices checked July 21, 2026 and shown only to explain billing models. Scope, languages, taxes, hardware, and human support differ, and competitor pricing may change.",
    apiPricingTitle: "WHY RAW VOICE API PRICES ARE NOT A COMPLETE INTERPRETATION PRICE",
    apiPricingCopy: "ElevenLabs lists real-time transcription at $0.39/hour and Flash text-to-speech at $0.05/1K characters; MiniMax lists speech generation at $60–100/million characters. These are infrastructure components—not a full translation workflow, meeting UI, captions, or venue audio output.",
    featuresTag: "BUILT TO DISAPPEAR",
    featuresTitle: ["Keep everyone", "with the meeting."],
    featuresIntro: "A Mac app designed around multilingual meetings—from room audio to captions and spoken interpretation, without sending the meeting to the cloud.",
    features: [
      ["Live meeting captions", "Capture room microphones or system audio and show source and translated text while the meeting is happening."],
      ["Spoken interpretation", "Play translated speech through Bluetooth headphones, system speakers, or a selected audio output device."],
      ["Private on-device processing", "Recognition, translation, and speech generation run locally on an Apple silicon Mac."],
      ["Meeting records", "Export or automatically save bilingual transcripts for follow-up without uploading the recording to the cloud."],
    ],
    howTag: "ADVANTAGE 04 · SIMPLE SETUP",
    howTitle: ["Connect room audio.", "Start live translation."],
    howNote: "CONNECT AUDIO → CHOOSE LANGUAGES → OUTPUT CAPTIONS + SPEECH",
    workflow: [
      ["CONNECT MEETING AUDIO", "Choose a room microphone, conferencing system, or Mac system audio."],
      ["TRANSCRIBE + TRANSLATE", "On-device AI recognizes each speaker and generates the target-language translation."],
      ["READ + LISTEN", "Show bilingual captions and play translated speech to headphones or system audio."],
    ],
    faqTag: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      ["How do attendees receive the translation?", "They can read bilingual captions and hear translated speech through Bluetooth headphones, system speakers, or a selected audio device. The final path depends on the venue and audience size."],
      ["Why run it locally?", "Local processing keeps meeting content on the device, reduces dependency on a continuous audio upload, and avoids cloud usage fees that accumulate with every meeting minute."],
      ["What equipment is required?", "An Apple silicon Mac running macOS 14 or later, plus a usable microphone, conferencing system, or system-audio input. Larger venues should test speakers and headphone routing in advance."],
      ["Does it replace a professional interpreter?", "Not in every setting. Structured business meetings and training are good candidates for assessment; high-risk or accountability-heavy events should retain a professional interpreter or human review."],
    ],
    commercialTag: "GET A MEETING PLAN",
    commercialTitle: ["Share the meeting details.", "Get a tailored deployment plan."],
    commercialCopy: "Tell us the date, audience size, language directions, and venue audio conditions. We’ll recommend the devices, caption and audio outputs, and number of simultaneous translation sessions.",
    commercialNote: "LOCATION · DATE + SIZE · INDUSTRY · LANGUAGES · CAPTION + HEADPHONE NEEDS",
    contactCta: "GET A RECOMMENDED SETUP",
    footerLine: "LOCAL LIVE CAPTIONS + SPOKEN INTERPRETATION FOR MEETINGS",
    footerLinks: ["USE CASES", "WHY LOCAL", "COST MODEL", "CONTACT"],
  },
} as const;

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const t = content[locale];
  const contactHref = `/contact/?lang=${locale}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const requested = new URLSearchParams(window.location.search).get("lang");
      const saved = window.localStorage.getItem("hen-local-locale");
      const nextLocale = requested === "zh" || requested === "en"
        ? requested
        : saved === "zh" || saved === "en"
          ? saved
          : navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
      setLocale(nextLocale);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  function chooseLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    window.localStorage.setItem("hen-local-locale", nextLocale);
    setLanguageOpen(false);
  }

  return (
    <main data-locale={locale}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t.homeLabel}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{t.brandName}</strong><small>{t.productName}</small></span>
        </a>
        <nav aria-label={t.navLabel}>
          <a href="#use-cases">{t.nav[0]}</a>
          <a href="#why-local">{t.nav[1]}</a>
          <a href="#cost">{t.nav[2]}</a>
          <a href="#how-it-works">{t.nav[3]}</a>
        </nav>
        <div className="header-actions">
          <a className="contact-link" href={contactHref}>{t.contactLink}</a>
          <div className="language-menu">
            <button className="language-trigger" type="button" aria-label={t.languageLabel} aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>{locale === "zh" ? "中" : "EN"}<span aria-hidden="true">⌄</span></button>
            {languageOpen && <div className="language-popover"><button type="button" aria-pressed={locale === "zh"} onClick={() => chooseLocale("zh")}>中文</button><button type="button" aria-pressed={locale === "en"} onClick={() => chooseLocale("en")}>English</button></div>}
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow-row"><span className="pill"><i /> {t.edition}</span><span>{t.platform}</span></div>
          <h1>{t.hero[0]}<br /><em>{t.hero[1]}</em></h1>
          <p className="hero-lede">{t.lede}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={contactHref}>{t.contactLink} <span aria-hidden="true">↗</span></a>
            <a className="button button-light" href="#use-cases">{t.seeHow} <span aria-hidden="true">↓</span></a>
          </div>
          <p className="access-note">{t.accessNote}</p>
          <p className="requirements">{t.requirements}</p>
        </div>

        <div className="product-stage" aria-label={t.previewLabel}>
          <div className="stage-accent" />
          <div className="app-window">
            <div className="window-bar">
              <div className="window-brand"><img src="/logo-mark.png" width="1024" height="1024" alt="" /><div><strong>{t.brandName}</strong><span>{t.productName}</span></div></div>
              <span className="ready"><i /> {t.app.ready}</span>
            </div>
            <div className="route-label">01&nbsp;&nbsp; {t.app.route}</div>
            <div className="language-route">
              <div><span>{t.app.source}</span><strong>{t.app.sourceValue}</strong></div><b aria-hidden="true">⇄</b><div><span>{t.app.target}</span><strong>{t.app.targetValue}</strong></div>
            </div>
            <div className="waveform" aria-hidden="true">{[14,24,38,18,31,52,26,60,35,20,44,29,54,34,18,42,25,48,16].map((height, index) => <i key={index} style={{ height }} />)}</div>
            <div className="launch-row"><span>{t.app.input}</span><strong>{t.app.start}&nbsp; →</strong></div>
          </div>
          <div className="subtitle-card">
            <div className="subtitle-topline"><span><i /> {t.app.live}</span><span>EN → 中文</span></div>
            <p>{t.app.sampleSource}</p><strong>{t.app.sampleTarget}</strong>
          </div>
        </div>
      </section>

      <nav className="advantage-rail" aria-label={locale === "zh" ? "四项核心优势" : "Four core advantages"}>
        {t.nav.map((item, index) => <a href={index === 0 ? "#use-cases" : index === 1 ? "#why-local" : index === 2 ? "#cost" : "#how-it-works"} key={item}><span>0{index + 1}</span><strong>{item}</strong><b aria-hidden="true">↓</b></a>)}
      </nav>

      <section className="use-cases-section" id="use-cases">
        <div className="use-cases-heading">
          <span className="story-label">{t.useCasesTag}</span>
          <div><h2>{t.useCasesTitle[0]}<br />{t.useCasesTitle[1]}</h2><p>{t.useCasesIntro}</p></div>
        </div>
        <div className="use-case-grid">
          {t.useCases.map(([title, copy, meta], index) => <article key={title}><span>0{index + 1}</span><small>{meta}</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="privacy-section" id="why-local">
        <div className="privacy-copy"><span className="story-label">{t.whyTag}</span><p className="kicker">{t.privacyKicker}</p><h2>{t.privacyTitle[0]}<br />{t.privacyTitle[1]}</h2><p>{t.privacyCopy}</p><div className="local-value-list">{t.localValues.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{copy}</p></div>)}</div></div>
        <div className="privacy-visual" aria-hidden="true">
          <div className="privacy-rings"><div><div><img src="/logo-mark.png" width="1024" height="1024" alt="" /></div></div></div>
          <span className="orbit-label label-one">{t.orbit[0]}</span><span className="orbit-label label-two">{t.orbit[1]}</span><span className="orbit-label label-three">{t.orbit[2]}</span><p>{t.stays}</p>
        </div>
      </section>

      <section className="cost-section" id="cost">
        <div className="cost-heading"><span className="story-label">{t.costTag}</span><div><h2>{t.costTitle[0]}<br />{t.costTitle[1]}</h2><p>{t.costIntro}</p></div></div>
        <div className="cost-grid">{t.costCards.map(([name, price, unit, copy], index) => <article className={index === 0 ? "cost-local" : ""} key={name}><span>0{index + 1}</span><h3>{name}</h3><strong>{price}</strong><b>{unit}</b><p>{copy}</p></article>)}</div>
        <div className="cost-evidence">
          <div><strong>{t.costSourceLabel}</strong><p>{t.costDisclaimer}</p></div>
          <div className="source-links"><a href="https://tongchuan.iflyrec.com/recharge.html" target="_blank" rel="noreferrer">讯飞同传 ↗</a><a href="https://maestra.ai/pricing?type=real-time" target="_blank" rel="noreferrer">Maestra ↗</a></div>
        </div>
        <div className="api-pricing-note"><strong>{t.apiPricingTitle}</strong><p>{t.apiPricingCopy}</p><div><a href="https://elevenlabs.io/pricing/api" target="_blank" rel="noreferrer">ElevenLabs API ↗</a><a href="https://platform.minimax.io/subscribe/token-plan?tab=api-enterprise" target="_blank" rel="noreferrer">MiniMax API ↗</a></div></div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="story-label">{t.howTag}</div>
        <div className="workflow-intro"><h2>{t.howTitle[0]}<br />{t.howTitle[1]}</h2><span>{t.howNote}</span></div>
        <div className="workflow-grid">{t.workflow.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><div className="step-glyph" aria-hidden="true">{index === 0 ? "◉" : index === 1 ? "≋" : "A·文"}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading"><span className="story-label">{t.faqTag}</span><h2>{t.faqTitle}</h2></div>
        <div className="faq-list" onMouseLeave={() => setActiveFaq(null)}>{t.faqs.map(([question, answer], index) => <article className={activeFaq === index ? "is-active" : ""} key={question} onMouseEnter={() => setActiveFaq(index)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveFaq(null); }}><button type="button" aria-expanded={activeFaq === index} onClick={() => setActiveFaq((current) => current === index ? null : index)}><span>0{index + 1}</span>{question}<b aria-hidden="true">＋</b></button><div className="faq-answer"><p>{answer}</p></div></article>)}</div>
      </section>

      <section className="access-section">
        <div className="access-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></div>
        <div><span className="section-tag">{t.commercialTag}</span><h2>{t.commercialTitle[0]}<br />{t.commercialTitle[1]}</h2><p>{t.commercialCopy}</p></div>
        <div className="access-actions"><span className="commercial-note">{t.commercialNote}</span><a className="button button-accent" href={contactHref}>{t.contactCta} <span aria-hidden="true">↗</span></a></div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span><span className="brand-copy"><strong>{t.brandName}</strong><small>{t.productName}</small></span></a>
        <p>{t.footerLine}</p>
        <div><a href="#use-cases">{t.footerLinks[0]}</a><a href="#why-local">{t.footerLinks[1]}</a><a href="#cost">{t.footerLinks[2]}</a><a href={contactHref}>{t.footerLinks[3]}</a></div>
        <small>© {new Date().getFullYear()} {t.brandName}</small>
      </footer>
    </main>
  );
}
