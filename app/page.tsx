"use client";

/* eslint-disable @next/next/no-img-element -- local static brand assets do not need runtime optimization */

import { useEffect, useState } from "react";
import ProjectCarousel, { type ServedProject } from "./components/ProjectCarousel";
import WorkflowDiagram from "./components/WorkflowDiagram";
import SpotIllustration from "./components/SpotIllustration";

type Locale = "zh" | "en";

const sceneIllustrations = ["scene-keynote", "scene-workshop", "scene-forum", "scene-hybrid"] as const;

const servedProjects = [
  {
    name: { zh: "AGIC 深圳通用人工智能展", en: "AGIC Shenzhen AI Expo 2026" },
    detail: { zh: "深圳 · 人工智能展会", en: "Shenzhen · Artificial intelligence exhibition" },
    start: "2026-08-26", end: "2026-08-28",
    scale: { zh: "十万人大会", en: "Major industry expo" },
    website: "https://www.szaiexpo.com/sz/",
    image: "/events/agic-2026.webp", artwork: "agic", imageOverlay: null,
    imageAlt: { zh: "AGIC 2026 深圳通用人工智能展官方主视觉", en: "Official key visual for AGIC Shenzhen AI Expo 2026" },
  },
  {
    name: { zh: "GOSIM Shenzhen 2026", en: "GOSIM Shenzhen 2026" },
    detail: { zh: "深圳 · 开源技术大会", en: "Shenzhen · Open-source conference" },
    start: "2026-10-16", end: "2026-10-17",
    scale: { zh: "千人大会", en: "Large conference" },
    website: "https://shenzhen2026.gosim.org/",
    image: "/events/gosim-shenzhen-2026-kv.jpg", artwork: "gosim-shenzhen", imageOverlay: null,
    imageAlt: { zh: "GOSIM Shenzhen 2026 蓝金色城市剪影宣传主视觉", en: "GOSIM Shenzhen 2026 promotional key visual with a blue and gold skyline" },
  },
  {
    name: { zh: "GOSIM Paris 2026", en: "GOSIM Paris 2026" },
    detail: { zh: "巴黎 · 开源技术大会", en: "Paris · Open-source conference" },
    start: "2026-05-04", end: "2026-05-06",
    scale: { zh: "千人大会", en: "Large conference" },
    website: "https://paris2026.gosim.org/",
    image: "/events/gosim-paris-2026-kv.jpg", artwork: "gosim-paris", imageOverlay: null,
    imageAlt: { zh: "GOSIM Paris 2026 绿色渐变与巴黎地标插画宣传主视觉", en: "GOSIM Paris 2026 promotional key visual with a green gradient and illustrated Paris landmarks" },
  },
  {
    name: { zh: "阿帕奇软件基金会亚洲大会", en: "Community Over Code Asia 2026" },
    detail: { zh: "北京 · Community Over Code Asia 2026", en: "Beijing · The Apache Software Foundation" },
    start: "2026-08-07", end: "2026-08-09",
    scale: { zh: "百人大会", en: "Community conference" },
    website: "https://asia.communityovercode.org/",
    image: "/events/coc-asia-2026.webp", artwork: "coc", imageOverlay: "/events/coc-asia-2026-title.webp",
    imageAlt: { zh: "Community Over Code Asia 2026 北京城市主视觉", en: "Official Beijing skyline key visual for Community Over Code Asia 2026" },
  },
  {
    name: { zh: "RustChinaConf 2026", en: "RustChinaConf 2026" },
    detail: { zh: "深圳 · Rust 开发者大会", en: "Shenzhen · Rust developer conference" },
    start: "2026-10-15", end: "2026-10-17",
    scale: { zh: "开发者大会", en: "Developer conference" },
    website: "https://rustchinaconf.org/",
    image: "/events/rustchina-2026.webp", artwork: "rust", imageOverlay: null,
    imageAlt: { zh: "RustChinaConf 2026 深圳天际线与螃蟹吉祥物主视觉", en: "Official RustChinaConf 2026 Shenzhen skyline and crab mascot key visual" },
  },
] as const satisfies readonly ServedProject[];

const content = {
  zh: {
    brandName: "很 Local",
    productName: "实时翻译",
    previewLabel: "很 Local 实时翻译界面预览",
    homeLabel: "很 Local 首页",
    navLabel: "主导航",
    nav: ["如何工作", "部署活动", "本地隐私", "适用场景", "成本方式"],
    languageLabel: "语言",
    contactLink: "咨询方案",
    edition: "本地实时翻译",
    platform: "现有 Mac · 核心翻译无需联网 · 音频不上传",
    hero: ["会议实时翻译，", "在你自己的 Mac 上完成。"],
    lede: "在现有 Apple 芯片 Mac 上，将会议音频实时转为双语字幕和译音。音频不上传，模型就绪后可离线使用。",
    seeHow: "了解工作方式",
    accessNote: "处理过程和默认数据存储均留在你的电脑里。",
    requirements: "macOS 14+ · Apple 芯片 Mac",
    projectsTag: "现场应用 · 本地翻译",
    projectsTitle: "部署活动",
    projectsIntro: "从百人社区，到十万人级展会。",
    projectGalleryLabel: "部署活动，横向滚动浏览",
    projectPrevious: "查看前面的活动",
    projectNext: "查看更多活动",
    projectWebsite: "查看活动官网",
    projectPause: "暂停自动滚动",
    projectPlay: "继续自动滚动",
    projectScaleLabel: "活动规模",
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
      sampleSource: "本地翻译隐私又安全。",
      sampleTarget: "Local translation is private and safe.",
    },
    ticker: ["会议同传", "实时字幕", "语音播报", "蓝牙耳机", "本地处理", "隐私优先", "系统音频", "会议同传"],
    useCasesTag: "产品能力 · 实时字幕与语音翻译",
    useCasesTitle: ["台上照常讲，", "台下实时看懂、听懂。"],
    useCasesIntro: "讲者照常发言，观众通过双语字幕、蓝牙耳机或会场音响，同步理解会议内容。",
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
    whyTag: "优势一 · 会议数据不出本机",
    privacyKicker: "本地运行，数据边界更清楚",
    privacyTitle: ["音频不上传，", "转录与译文不出本机。"],
    privacyCopy: "识别、翻译与语音生成全部在 Mac 上完成。处理过程和默认数据存储均留在你的电脑里。",
    localValues: [
      ["默认留在本机", "音频、转录、翻译和语音生成不必上传云端。"],
      ["离线也能工作", "模型准备完成后，核心翻译不依赖现场网络。"],
      ["费用更可预测", "会议时长不会继续产生云端转写、翻译和语音播报的按量费用。"],
    ],
    orbit: ["音频", "转录", "翻译"],
    stays: "默认留在本机",
    costTag: "成本方式",
    costTitle: ["会议开得越多，", "越不该被按分钟收费。"],
    costIntro: "核心处理在现有 Mac 上完成，会议时长不产生云端用量费。适合长时间、多场次使用。",
    costCards: [
      ["很 Local", "本地处理", "会议时长不产生云端用量费", "软件授权、部署支持和现场服务根据会议需求询价。"],
      ["讯飞同传企业版", "¥4,080 / 100 小时起", "约 ¥40.8 / 小时", "500 小时 ¥18,000；1000 小时 ¥33,600。套餐有效期与服务范围以官方页面为准。"],
      ["Maestra 实时翻译", "$79 / 月", "含 180 分钟 / 每种语言", "Business 为 $159/月、含 360 分钟实时翻译或 180 分钟实时配音。"],
    ],
    costSourceLabel: "公开价格参考",
    costDisclaimer: "价格查询于 2026 年 7 月 21 日，仅用于解释计费方式；产品范围、语言、税费、硬件和人工保障并不完全相同，竞品价格可能随时调整。",
    featuresTag: "安静地融入工作",
    featuresTitle: ["让每一位参会者，", "同步理解现场。"],
    featuresIntro: "围绕跨语言会议设计的 Mac 应用，从现场收音到字幕和语音播报，全程无需把会议发送到云端。",
    features: [
      ["会议实时字幕", "通过麦克风或系统音频捕捉现场发言，在会议进行时同步显示源语言与译文。"],
      ["实时语音同传", "将译文实时播报到蓝牙耳机、系统扬声器或指定音频设备，让参会者直接听见译文。"],
      ["本地隐私处理", "语音识别、翻译与语音生成均在 Apple 芯片 Mac 上完成，会议内容不离开设备。"],
      ["会议记录与回顾", "导出或自动保存双语转录，便于会后整理重点，同时无需把录音交给云端。"],
    ],
    howTag: "工作原理 · 使用现有 Mac",
    howTitle: ["从一句话，", "到全场都看懂。"],
    diagramLabel: "工作流程：麦克风采集讲者声音，Mac 在本地识别和翻译，电视同步显示双语字幕。",
    faqTag: "FAQ",
    faqTitle: "常见问题",
    faqs: [
      ["真的不需要联网吗？", "模型安装完成后，语音识别和翻译等核心功能可离线运行。模型下载、软件更新或授权配置可能需要短暂联网。"],
      ["哪些 Mac 可以运行？", "需要运行 macOS 14 或更高版本的 Apple 芯片 Mac。我们实测，2021 款 M1 Pro MacBook Pro（16GB 内存）即可流畅运行。"],
      ["会议音频和转录会被保存或上传吗？", "处理过程和默认数据存储均留在本机，不会为了完成翻译而把会议音频上传云端。只有在你主动导出或分享时，才会生成可移交的文件。"],
      ["需要哪些输入和输出设备？", "收音可用通过声卡接入的麦克风、USB 麦克风或大疆无线麦克风，以上方式均已实测，可正常使用。双语字幕可通过 HDMI 或投屏，显示在电视、投影仪或会场大屏上。"],
      ["能否替代专业译员？", "不能一概而论。结构化会议、培训和一般商务场景适合先评估 AI 同传；高风险、强专业责任或复杂多人对话场景应保留专业译员或人工复核。"],
    ],
    commercialTag: "获取会议方案",
    commercialTitle: ["下一场会议，", "一起让交流更顺畅。"],
    commercialCopy: "告诉我们你的 Mac 配置、会议规模和语言需求，我们会通过邮件回复部署建议。",
    commercialNote: "Mac 配置 · 会议规模 · 语言需求",
    contactCta: "提交需求，获取方案",
    footerLine: "不上传、不联网，运行在你现有 Mac 上的会议实时翻译。",
    footerLinks: ["本地隐私", "如何工作", "适用场景", "成本方式", "联系我们"],
  },
  en: {
    brandName: "HEN LOCAL",
    productName: "LIVE TRANSLATOR",
    previewLabel: "HEN LOCAL LIVE TRANSLATOR interface preview",
    homeLabel: "HEN LOCAL home",
    navLabel: "Primary navigation",
    nav: ["HOW IT WORKS", "EVENTS", "PRIVACY", "USE CASES", "COST"],
    languageLabel: "LANGUAGE",
    contactLink: "CONTACT",
    edition: "PRIVATE, ON-DEVICE TRANSLATION",
    platform: "YOUR MAC · CORE TRANSLATION WORKS OFFLINE",
    hero: ["Live meeting translation,", "on your own Mac."],
    lede: "Turn meeting audio into bilingual captions and translated speech on your Apple silicon Mac. No audio uploads. Works offline once models are ready.",
    seeHow: "HOW IT WORKS",
    accessNote: "Processing and default data storage stay on your computer.",
    requirements: "macOS 14+ · Apple silicon Mac",
    projectsTag: "IN THE FIELD · ON-DEVICE TRANSLATION",
    projectsTitle: "Event deployments",
    projectsIntro: "From community meetups to major exhibitions.",
    projectGalleryLabel: "Event deployments, scroll horizontally to explore",
    projectPrevious: "Previous events",
    projectNext: "More events",
    projectWebsite: "Visit official event website",
    projectPause: "Pause automatic scrolling",
    projectPlay: "Resume automatic scrolling",
    projectScaleLabel: "Event scale",
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
      sampleSource: "Local translation is private and safe.",
      sampleTarget: "本地翻译隐私又安全。",
    },
    ticker: ["MEETING INTERPRETATION", "LIVE CAPTIONS", "SPOKEN OUTPUT", "BLUETOOTH AUDIO", "ON-DEVICE", "PRIVATE", "SYSTEM AUDIO", "REAL-TIME"],
    useCasesTag: "PRODUCT CAPABILITY · LIVE CAPTIONS + INTERPRETATION",
    useCasesTitle: ["The speaker keeps speaking.", "Everyone else keeps up."],
    useCasesIntro: "Speakers keep speaking. Attendees follow along through bilingual captions, Bluetooth headphones, or venue audio.",
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
    whyTag: "ADVANTAGE 01 · MEETING DATA STAYS LOCAL",
    privacyKicker: "ON-DEVICE PROCESSING WITH A CLEAR DATA BOUNDARY",
    privacyTitle: ["No audio uploads.", "No cloud transcript."],
    privacyCopy: "Recognition, translation, and speech generation run on your Mac. Processing and default data storage stay on your computer.",
    localValues: [
      ["Local by default", "Audio, transcripts, translation, and generated speech do not need to be uploaded."],
      ["Works offline", "Once models are ready, core translation does not depend on venue internet."],
      ["More predictable cost", "Longer sessions do not create additional cloud transcription, translation, and speech-output usage fees."],
    ],
    orbit: ["AUDIO", "TRANSCRIPT", "TRANSLATION"],
    stays: "LOCAL BY DEFAULT",
    costTag: "COST MODEL",
    costTitle: ["Run more meetings", "without per-minute cloud fees."],
    costIntro: "Core processing runs on the Mac you have, without cloud usage fees tied to meeting length. Built for long sessions and frequent use.",
    costCards: [
      ["HEN LOCAL", "ON-DEVICE PROCESSING", "No cloud usage fee tied to meeting length", "Software licensing, deployment support, and event services are quoted for the actual meeting."],
      ["iFLYREC Enterprise", "FROM ¥4,080 / 100 HOURS", "ABOUT ¥40.8 / HOUR", "¥18,000 for 500 hours and ¥33,600 for 1,000 hours. Term and service scope follow the official offer."],
      ["Maestra Real-Time", "$79 / MONTH", "180 MINUTES / LANGUAGE", "Business is $159/month with 360 minutes of real-time translation or 180 minutes of real-time dubbing."],
    ],
    costSourceLabel: "PUBLIC PRICE REFERENCES",
    costDisclaimer: "Prices checked July 21, 2026 and shown only to explain billing models. Scope, languages, taxes, hardware, and human support differ, and competitor pricing may change.",
    featuresTag: "BUILT TO DISAPPEAR",
    featuresTitle: ["Keep everyone", "with the meeting."],
    featuresIntro: "A Mac app designed around multilingual meetings—from room audio to captions and spoken interpretation, without sending the meeting to the cloud.",
    features: [
      ["Live meeting captions", "Capture room microphones or system audio and show source and translated text while the meeting is happening."],
      ["Spoken interpretation", "Play translated speech through Bluetooth headphones, system speakers, or a selected audio output device."],
      ["Private on-device processing", "Recognition, translation, and speech generation run locally on an Apple silicon Mac."],
      ["Meeting records", "Export or automatically save bilingual transcripts for follow-up without uploading the recording to the cloud."],
    ],
    howTag: "HOW IT WORKS · ON YOUR MAC",
    howTitle: ["From a spoken word", "to a shared understanding."],
    diagramLabel: "How it works: a microphone captures the speaker, the Mac recognizes and translates locally, and a TV displays bilingual captions.",
    faqTag: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      ["Does it really work without an internet connection?", "Once the models are installed, core speech recognition and translation work offline. Model downloads, software updates, or license setup may require a brief connection."],
      ["Which Macs can run it?", "You need an Apple silicon Mac running macOS 14 or later. In our tests, a 2021 MacBook Pro with an M1 Pro chip and 16GB of memory runs smoothly."],
      ["Are meeting audio and transcripts saved or uploaded?", "Processing and default data storage stay on the Mac. Meeting audio is not uploaded to complete translation; shareable files are created only when you choose to export or share them."],
      ["What input and output hardware do I need?", "For audio input, we have tested microphones connected through an audio interface, USB microphones, and DJI wireless microphones; all work well. Bilingual captions can be displayed on a TV, projector, or venue screen over HDMI or screen casting."],
      ["Does it replace a professional interpreter?", "Not in every setting. Structured business meetings and training are good candidates for assessment; high-risk or accountability-heavy events should retain a professional interpreter or human review."],
    ],
    commercialTag: "GET A MEETING PLAN",
    commercialTitle: ["Your next meeting.", "A little more connected."],
    commercialCopy: "Share your Mac, meeting size, and languages. We’ll reply by email with a recommended setup.",
    commercialNote: "YOUR MAC · MEETING SIZE · LANGUAGES",
    contactCta: "GET A RECOMMENDED SETUP",
    footerLine: "NO UPLOADS. OFFLINE CORE TRANSLATION ON YOUR EXISTING MAC.",
    footerLinks: ["PRIVACY", "HOW IT WORKS", "USE CASES", "COST", "CONTACT"],
  },
} as const;

const navHrefs = ["#how-it-works", "#projects", "#why-local", "#use-cases", "#cost"] as const;

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
    <main id="top" data-locale={locale}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t.homeLabel}>
          <span className="brand-mark" aria-hidden="true"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span>
          <span className="brand-copy"><strong>{t.brandName}</strong><small>{t.productName}</small></span>
        </a>
        <nav aria-label={t.navLabel}>
          {t.nav.map((item, index) => <a href={navHrefs[index]} key={item}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <a className="contact-link" href={contactHref}>{t.contactLink}</a>
          <div className="language-menu">
            <button className="language-trigger" type="button" aria-label={t.languageLabel} aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>{locale === "zh" ? "中" : "EN"}<span aria-hidden="true">⌄</span></button>
            {languageOpen && <div className="language-popover"><button type="button" aria-pressed={locale === "zh"} onClick={() => chooseLocale("zh")}>中文</button><button type="button" aria-pressed={locale === "en"} onClick={() => chooseLocale("en")}>English</button></div>}
          </div>
        </div>
      </header>

      <section className="hero" id="product" aria-labelledby="product-title">
        <div className="hero-copy">
          <div className="eyebrow-row"><span className="pill"><i /> {t.edition}</span></div>
          <h1 className="hero-title" id="product-title">{t.hero[0]}<br /><em>{t.hero[1]}</em></h1>
          <p className="hero-lede">{t.lede}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={contactHref}>{t.contactLink} <span aria-hidden="true">↗</span></a>
            <a className="button button-light" href="#how-it-works">{t.seeHow} <span aria-hidden="true">↓</span></a>
          </div>
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

      <section className="workflow-section" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow-intro">
          <span className="story-label">{t.howTag}</span>
          <h2 id="workflow-title">{t.howTitle.join(locale === "en" ? " " : "")}</h2>
        </div>
        <WorkflowDiagram labels={t} />
      </section>

      <ProjectCarousel projects={servedProjects} locale={locale} labels={t} />

      <section className="privacy-section" id="why-local">
        <div className="privacy-heading"><span className="story-label">{t.whyTag}</span><h2>{t.privacyTitle[0]}<br />{t.privacyTitle[1]}</h2></div>
        <p className="privacy-summary">{t.privacyCopy}</p>
        <div className="local-value-list">{t.localValues.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{copy}</p></div>)}</div>
        <SpotIllustration name="privacy-local" className="privacy-illustration" />
      </section>

      <section className="use-cases-section" id="use-cases">
        <div className="use-cases-heading">
          <span className="story-label">{t.useCasesTag}</span>
          <div><h2>{t.useCasesTitle[0]}<br />{t.useCasesTitle[1]}</h2><p>{t.useCasesIntro}</p></div>
        </div>
        <div className="use-case-grid">
          {t.useCases.map(([title, copy, meta], index) => <article key={title}>
            <div className="use-case-heading"><div className="use-case-meta"><span>0{index + 1}</span><small>{meta}</small></div><h3>{title}</h3></div>
            <SpotIllustration name={sceneIllustrations[index]} className="use-case-illustration" />
            <p>{copy}</p>
          </article>)}
        </div>
      </section>

      <section className="cost-section" id="cost">
        <div className="cost-heading"><span className="story-label">{t.costTag}</span><div><h2>{t.costTitle[0]}<br />{t.costTitle[1]}</h2><p>{t.costIntro}</p></div><SpotIllustration name="cost-multiple-meetings" className="cost-illustration" /></div>
        <div className="cost-grid">{t.costCards.map(([name, price, unit, copy], index) => <article className={index === 0 ? "cost-local" : ""} key={name}><span>0{index + 1}</span><h3>{name}</h3><strong>{price}</strong><b>{unit}</b><p>{copy}</p></article>)}</div>
        <div className="cost-evidence">
          <div><strong>{t.costSourceLabel}</strong><p>{t.costDisclaimer}</p></div>
          <div className="source-links"><a href="https://tongchuan.iflyrec.com/recharge.html" target="_blank" rel="noreferrer">讯飞同传 ↗</a><a href="https://maestra.ai/pricing?type=real-time" target="_blank" rel="noreferrer">Maestra ↗</a></div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-heading"><span className="story-label">{t.faqTag}</span><h2>{t.faqTitle}</h2></div>
        <div className="faq-list">{t.faqs.map(([question, answer], index) => <article className={activeFaq === index ? "is-active" : ""} key={question}>
          <button type="button" aria-expanded={activeFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setActiveFaq((current) => current === index ? null : index)}><span>0{index + 1}</span>{question}<b aria-hidden="true">＋</b></button>
          <div className="faq-answer" id={`faq-answer-${index}`} aria-hidden={activeFaq !== index}><div className="faq-answer-content">
            <p>{answer}</p>
            {index === 3 && <figure className="faq-hardware"><SpotIllustration name="hardware-connections" alt={locale === "zh" ? "声卡、USB 麦克风和无线麦克风接入 Mac，再通过 HDMI 或投屏输出双语字幕。" : "An audio interface, USB microphone, or wireless microphone connects to the Mac, with bilingual captions sent to a display over HDMI or screen casting."} /></figure>}
          </div></div>
        </article>)}</div>
      </section>

      <section className="access-section">
        <div className="access-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></div>
        <div><span className="section-tag">{t.commercialTag}</span><h2>{t.commercialTitle[0]}<br />{t.commercialTitle[1]}</h2><p>{t.commercialCopy}</p></div>
        <div className="access-actions"><span className="commercial-note">{t.commercialNote}</span><a className="button button-accent" href={contactHref}>{t.contactCta} <span aria-hidden="true">↗</span></a></div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/logo-mark.png" width="1024" height="1024" alt="" /></span><span className="brand-copy"><strong>{t.brandName}</strong><small>{t.productName}</small></span></a>
        <p>{t.footerLine}</p>
        <div><a href="#why-local">{t.footerLinks[0]}</a><a href="#how-it-works">{t.footerLinks[1]}</a><a href="#use-cases">{t.footerLinks[2]}</a><a href="#cost">{t.footerLinks[3]}</a><a href={contactHref}>{t.footerLinks[4]}</a></div>
        <small>© {new Date().getFullYear()} {t.brandName}</small>
      </footer>
    </main>
  );
}
