from __future__ import annotations

import time
from functools import lru_cache
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from core import (
    final_query_system_production,
    translate_to_english,
    translate_strings,
    translate_to_user_lang,
)

app = FastAPI(title="Jeevant Healthcare Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache(maxsize=100)
def cached_query(query: str) -> dict[str, Any]:
    return final_query_system_production(query)


@app.get("/query")
def query(q: str = Query(..., min_length=2), lang: str = Query("en")) -> dict[str, Any]:
    started_at = time.perf_counter()
    try:
        normalized_query = q.strip()
        normalized_lang = (lang or "en").lower()
        effective_query = (
            translate_to_english(normalized_query, source_lang=normalized_lang)
            if normalized_lang != "en"
            else normalized_query
        )

        result = cached_query(effective_query)
        if normalized_lang != "en":
            result = translate_to_user_lang(result, target_lang=normalized_lang)

        if not result.get("top_facilities"):
            result["metadata"] = {
                **(result.get("metadata") or {}),
                "fallback": "No matching facilities found for this query.",
            }
        result["metadata"] = {
            **(result.get("metadata") or {}),
            "latency_ms": round((time.perf_counter() - started_at) * 1000, 2),
        }
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to process query: {exc}") from exc


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


class TranslateUiRequest(BaseModel):
    lang: str
    texts: list[str]


@app.post("/translate-ui")
def translate_ui(payload: TranslateUiRequest) -> dict[str, list[str]]:
    try:
        normalized_lang = (payload.lang or "en").lower()
        translated = translate_strings(payload.texts, target_lang=normalized_lang)
        return {"texts": translated}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to translate UI texts: {exc}") from exc
