type WorkflowDiagramProps = {
  labels: { diagramLabel: string };
};

export default function WorkflowDiagram({ labels }: WorkflowDiagramProps) {
  return (
    <figure className="workflow-diagram">
      <picture>
        <source media="(max-width: 700px)" srcSet="/workflow/translation-flow-mobile.png" width={941} height={1672} />
        <img
          className="workflow-illustration"
          src="/workflow/translation-flow-desktop.png"
          alt={labels.diagramLabel}
          width={1983}
          height={793}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </figure>
  );
}
