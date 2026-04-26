from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any

from extraction import extract_facility
from ranking import hard_filter_and_rank
from retrieval import parse_query_requirements, retrieve_candidates
from translation import BhashiniTranslator

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "facilities.pkl"

_FACILITIES_CACHE: list[dict[str, Any]] | None = None
_TRANSLATOR = BhashiniTranslator()


def _load_facilities() -> list[dict[str, Any]]:
    global _FACILITIES_CACHE
    if _FACILITIES_CACHE is None:
        with DATA_FILE.open("rb") as file:
            _FACILITIES_CACHE = pickle.load(file)
    return _FACILITIES_CACHE


def translate_to_english(query: str, source_lang: str = "en") -> str:
    return _TRANSLATOR.translate_text(query, source_lang=source_lang, target_lang="en")


def _translate_reasoning_list(items: list[str], target_lang: str) -> list[str]:
    return [
        _TRANSLATOR.translate_text(item, source_lang="en", target_lang=target_lang)
        for item in items
        if isinstance(item, str) and item
    ]


def translate_to_user_lang(payload: dict[str, Any], target_lang: str = "en") -> dict[str, Any]:
    if target_lang == "en":
        return payload
    translated = json.loads(json.dumps(payload))
    translated["query"] = _TRANSLATOR.translate_text(
        translated.get("query", ""), source_lang="en", target_lang=target_lang
    )

    for facility in translated.get("top_facilities", []):
        facility["reasoning"] = _translate_reasoning_list(
            facility.get("reasoning", []), target_lang=target_lang
        )
    for rejected in translated.get("rejected_options", []):
        reasons = rejected.get("rejection_reason") or rejected.get("reason") or []
        translated_reasons = _translate_reasoning_list(reasons, target_lang=target_lang)
        if "rejection_reason" in rejected:
            rejected["rejection_reason"] = translated_reasons
        else:
            rejected["reason"] = translated_reasons
    return translated


def translate_strings(texts: list[str], target_lang: str) -> list[str]:
    if target_lang == "en":
        return texts
    return [
        _TRANSLATOR.translate_text(text, source_lang="en", target_lang=target_lang)
        if isinstance(text, str)
        else ""
        for text in texts
    ]


def final_query_system_production(query: str) -> dict[str, Any]:
    facilities = _load_facilities()
    requirements = parse_query_requirements(query)
    candidates, pre_filtered_out = retrieve_candidates(facilities, query, requirements, k_retrieve=200)

    enriched_candidates: list[dict[str, Any]] = []
    for row in candidates:
        structured = extract_facility(row)["structured"]
        enriched_candidates.append({**row, "capabilities": structured})

    top_facilities, rejected_options, ranking_meta = hard_filter_and_rank(
        enriched_candidates, requirements, k_final=3
    )

    return {
        "query": query,
        "requirements": requirements,
        "top_facilities": top_facilities,
        "rejected_options": rejected_options,
        "metadata": {
            "retrieved": len(candidates),
            "pre_filtered_out": pre_filtered_out,
            "extracted": len(enriched_candidates),
            **ranking_meta,
        },
    }
