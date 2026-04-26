import axios from "axios";
import type { QueryResponse } from "@/types/query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export async function fetchHealthcareResults(query: string, lang: string): Promise<QueryResponse> {
  const { data } = await api.get<QueryResponse>("/query", {
    params: { q: query, lang },
  });
  return data;
}

export async function translateUiTexts(lang: string, texts: string[]): Promise<string[]> {
  const { data } = await api.post<{ texts: string[] }>("/translate-ui", { lang, texts });
  return data.texts ?? texts;
}
