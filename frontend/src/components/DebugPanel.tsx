import type { QueryMetadata, QueryRequirements } from "@/types/query";

type DebugPanelProps = {
  query: string;
  requirements: QueryRequirements;
  metadata: QueryMetadata;
  title: string;
  queryLabel: string;
  requirementsLabel: string;
  metadataLabel: string;
};

export function DebugPanel({
  query,
  requirements,
  metadata,
  title,
  queryLabel,
  requirementsLabel,
  metadataLabel,
}: DebugPanelProps) {
  return (
    <details className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800">{title}</summary>
      <div className="mt-3 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
        <div>
          <h4 className="font-bold text-slate-900">{queryLabel}</h4>
          <p className="mt-1 break-words">{query || "N/A"}</p>
          <h4 className="mt-3 font-bold text-slate-900">{requirementsLabel}</h4>
          <pre className="mt-1 rounded-md bg-slate-100 p-2 text-xs">{JSON.stringify(requirements ?? {}, null, 2)}</pre>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{metadataLabel}</h4>
          <pre className="mt-1 rounded-md bg-slate-100 p-2 text-xs">{JSON.stringify(metadata ?? {}, null, 2)}</pre>
        </div>
      </div>
    </details>
  );
}
