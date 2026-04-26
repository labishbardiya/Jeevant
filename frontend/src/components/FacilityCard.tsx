import type { Facility } from "@/types/query";

type FacilityCardProps = {
  facility: Facility;
  texts: {
    trustScore: string;
    finalScore: string;
    requirementCoverage: string;
  };
};

function trustColor(score: number): string {
  if (score > 0.7) return "bg-emerald-500";
  if (score >= 0.4) return "bg-amber-500";
  return "bg-rose-500";
}

function badgeTone(value: string): string {
  if (value === "true" || value === "24/7") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (value === "partial" || value === "visiting" || value === "limited") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  if (value === "false") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function CapabilityBadge({ name, value }: { name: string; value: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${badgeTone(value)}`}>
      {name}: {value}
    </span>
  );
}

export function FacilityCard({ facility, texts }: FacilityCardProps) {
  const trustPercent = Math.round((facility.trust_score ?? 0) * 100);
  const coveragePercent = Math.round((facility.requirement_coverage ?? 0) * 100);

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{facility.name}</h3>
          <p className="text-sm text-slate-600">
            {facility.city}, {facility.state}
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-700">
          {texts.finalScore}: {facility.final_score?.toFixed(3)}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{texts.trustScore}</span>
          <span className="font-semibold text-slate-900">{trustPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div className={`h-2 rounded-full ${trustColor(facility.trust_score ?? 0)}`} style={{ width: `${trustPercent}%` }} />
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">
        {texts.requirementCoverage}: <span className="font-semibold">{coveragePercent}%</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <CapabilityBadge name="ICU" value={facility.capabilities?.icu ?? "unknown"} />
        <CapabilityBadge name="Surgery" value={facility.capabilities?.surgery ?? "unknown"} />
        <CapabilityBadge name="Oxygen" value={facility.capabilities?.oxygen ?? "unknown"} />
        <CapabilityBadge name="Anesthesiologist" value={facility.capabilities?.anesthesiologist ?? "unknown"} />
        <CapabilityBadge name="Availability" value={facility.capabilities?.availability ?? "unknown"} />
      </div>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {facility.reasoning?.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </article>
  );
}
