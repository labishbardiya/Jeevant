import type { RejectedOption } from "@/types/query";

type RejectedSectionProps = {
  rejected: RejectedOption[];
  title: string;
  emptyText: string;
};

export function RejectedSection({ rejected, title, emptyText }: RejectedSectionProps) {
  if (!rejected.length) {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4">
        {rejected.map((option) => {
          const reasons = option.rejection_reason ?? option.reason ?? [];
          return (
            <article key={option.name} className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
              <h3 className="font-semibold text-slate-900">{option.name}</h3>
              {option.city ? <p className="text-xs text-slate-600">{option.city}</p> : null}
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
                {reasons.map((reason) => <li key={`${option.name}-${reason}`}>{reason}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
