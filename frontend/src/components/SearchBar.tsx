"use client";

import { useMemo, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

type SpeechRecognitionResultLike = {
  transcript?: string;
};

type SpeechRecognitionEventLike = {
  results?: Array<Array<SpeechRecognitionResultLike>>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

type SpeechWindowLike = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
};

type SearchBarProps = {
  query: string;
  language: string;
  loading: boolean;
  texts: {
    searchPlaceholder: string;
    searchButton: string;
    analyzingButton: string;
    micStart: string;
    micListening: string;
    micUnsupported: string;
  };
  onQueryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({
  query,
  language,
  loading,
  texts,
  onQueryChange,
  onLanguageChange,
  onSubmit,
}: SearchBarProps) {
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechLocale = useMemo(
    () => SUPPORTED_LANGUAGES.find((item) => item.code === language)?.speechLocale ?? "en-IN",
    [language]
  );

  const handleSpeechInput = () => {
    const speechWindow = window as SpeechWindowLike;
    const SpeechRecognitionApi = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognitionApi) {
      setSpeechError(texts.micUnsupported);
      return;
    }

    setSpeechError("");
    const recognition = new SpeechRecognitionApi();
    recognition.lang = speechLocale;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) onQueryChange(transcript.trim());
    };
    recognition.onerror = () => setSpeechError(texts.micUnsupported);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={texts.searchPlaceholder}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value)}
          className="min-w-32 rounded-xl border border-slate-300 px-3 py-3 text-slate-900 outline-none focus:border-cyan-500"
        >
          {SUPPORTED_LANGUAGES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSpeechInput}
          disabled={loading || listening}
          className="rounded-xl border border-cyan-600 px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
          title={texts.micStart}
        >
          {listening ? texts.micListening : texts.micStart}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !query.trim()}
          className="rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? texts.analyzingButton : texts.searchButton}
        </button>
      </div>
      {speechError ? <p className="mt-2 text-xs text-rose-600">{speechError}</p> : null}
    </section>
  );
}
