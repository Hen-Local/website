import type { Locale } from "../../i18n/routing";

type WorkflowDiagramProps = {
  locale: Locale;
  labels: { diagramLabel: string };
};

const images = {
  zh: {
    desktop: { src: "/workflow/translation-flow-desktop-spaced.png", width: 1983, height: 520 },
    mobile: { src: "/workflow/translation-flow-mobile-spaced.png", width: 626, height: 1361 },
  },
  en: {
    desktop: { src: "/workflow/translation-flow-desktop-en.png", width: 2172, height: 724 },
    mobile: { src: "/workflow/translation-flow-mobile-en.png", width: 851, height: 1849 },
  },
} as const;

export default function WorkflowDiagram({ locale, labels }: WorkflowDiagramProps) {
  const { desktop, mobile } = images[locale];
  return (
    <figure className="workflow-diagram">
      <picture>
        <source media="(max-width: 700px)" srcSet={mobile.src} width={mobile.width} height={mobile.height} />
        <img
          className="workflow-illustration"
          src={desktop.src}
          alt={labels.diagramLabel}
          width={desktop.width}
          height={desktop.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </figure>
  );
}
