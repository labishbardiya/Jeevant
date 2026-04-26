"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";
import { fetchHealthcareResults, translateUiTexts } from "@/lib/api";
import type { QueryResponse } from "@/types/query";
import { FacilityCard } from "@/components/FacilityCard";
import { RejectedSection } from "@/components/RejectedSection";
import { FacilityMap } from "@/components/FacilityMap";
import { DebugPanel } from "@/components/DebugPanel";
import { EN_TEXT, getText, UI_TEXT_KEYS, type UIText } from "@/lib/i18n";

const initialData: QueryResponse = {
  query: "",
  requirements: {},
  top_facilities: [],
  rejected_options: [],
  metadata: {},
};

export default function Home() {
  const [query, setQuery] = useState("Emergency surgery hospital Jaipur");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<QueryResponse>(initialData);
  const [runtimeTexts, setRuntimeTexts] = useState<UIText>(EN_TEXT);
  const fallbackTexts = useMemo(() => getText(language), [language]);
  const activeTexts = language === "en" || language === "hi" ? fallbackTexts : runtimeTexts;

  useEffect(() => {
    let cancelled = false;
    // For English/Hindi we ship static labels, for remaining languages use backend translation.
    if (language === "en" || language === "hi") {
      return;
    }

    const englishValues = UI_TEXT_KEYS.map((key) => EN_TEXT[key]);
    translateUiTexts(language, englishValues)
      .then((translatedValues) => {
        if (cancelled) return;
        const next: UIText = { ...EN_TEXT };
        UI_TEXT_KEYS.forEach((key, idx) => {
          next[key] = translatedValues[idx] || EN_TEXT[key];
        });
        setRuntimeTexts(next);
      })
      .catch(() => setRuntimeTexts(EN_TEXT));

    return () => {
      cancelled = true;
    };
  }, [language]);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetchHealthcareResults(trimmed, language);
      setData(response);
      if (!response.top_facilities?.length) {
        setError(response.metadata?.fallback ?? activeTexts.noMatch);
      }
    } catch {
      setError(activeTexts.apiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8">
        <header className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <Image src="/jeevant-logo.png" alt="Jeevant logo" width={60} height={60} priority className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Jeevant</h1>
              <p className="text-sm text-slate-600">{activeTexts.appSubtitle}</p>
            </div>
          </div>
        </header>

        <SearchBar
          query={query}
          language={language}
          loading={loading}
          texts={activeTexts}
          onQueryChange={setQuery}
          onLanguageChange={setLanguage}
          onSubmit={handleSearch}
        />

        {error ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</section>
        ) : null}

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{activeTexts.topResults}</h2>
          {!data.top_facilities.length ? (
            <p className="mt-2 text-sm text-slate-600">{activeTexts.runQueryHint}</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {data.top_facilities.map((facility) => (
                <FacilityCard key={`${facility.name}-${facility.city}`} facility={facility} texts={activeTexts} />
              ))}
            </div>
          )}
        </section>

        <RejectedSection
          rejected={data.rejected_options ?? []}
          title={activeTexts.whyNot}
          emptyText={activeTexts.noRejected}
        />
        <FacilityMap facilities={data.top_facilities ?? []} title={activeTexts.map} />
        <DebugPanel
          query={data.query}
          requirements={data.requirements}
          metadata={data.metadata}
          title={activeTexts.debugPanel}
          queryLabel={activeTexts.query}
          requirementsLabel={activeTexts.requirements}
          metadataLabel={activeTexts.metadata}
        />
      </main>
    </div>
  );
}
