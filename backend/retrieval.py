from __future__ import annotations

from typing import Any


def parse_query_requirements(query: str) -> dict[str, bool]:
    q = query.lower()
    needs_surgery = any(word in q for word in ["surgery", "surgical", "operation", "surgeon"])
    needs_icu = any(word in q for word in ["icu", "intensive care", "critical care"])
    needs_emergency = any(word in q for word in ["emergency", "urgent", "trauma", "critical"])
    needs_dialysis = any(word in q for word in ["dialysis", "kidney", "renal", "hemodialysis"])

    # Emergency surgery implies ICU support.
    if needs_emergency and needs_surgery:
        needs_icu = True

    return {
        "needs_surgery": needs_surgery,
        "needs_icu": needs_icu,
        "needs_emergency": needs_emergency,
        "needs_dialysis": needs_dialysis,
    }


def quick_reject_pre_filter(row: dict[str, Any], requirements: dict[str, bool]) -> bool:
    text = (row.get("combined_text") or "").lower()
    if not text:
        return False

    if requirements["needs_surgery"] and not any(
        kw in text for kw in ["surgery", "surgical", "operation", "surgeon", "theatre", "ot"]
    ):
        return True

    if requirements["needs_icu"] and not any(
        kw in text for kw in ["icu", "intensive care", "critical care", "nicu", "picu", "cicu"]
    ):
        return True

    if requirements["needs_dialysis"] and not any(
        kw in text for kw in ["dialysis", "kidney", "renal", "hemodialysis", "peritoneal"]
    ):
        return True

    return False


def keyword_similarity(query: str, row: dict[str, Any]) -> float:
    query_tokens = {token for token in query.lower().split() if token}
    text_tokens = set((row.get("combined_text") or "").split())
    if not query_tokens:
        return 0.0
    overlap = len(query_tokens.intersection(text_tokens))
    return overlap / max(1, len(query_tokens))


def retrieve_candidates(
    facilities: list[dict[str, Any]],
    query: str,
    requirements: dict[str, bool],
    k_retrieve: int = 200,
) -> tuple[list[dict[str, Any]], int]:
    pre_filtered_out = 0
    candidates: list[dict[str, Any]] = []

    for row in facilities:
        if quick_reject_pre_filter(row, requirements):
            pre_filtered_out += 1
            continue
        row_copy = dict(row)
        row_copy["retrieval_score"] = keyword_similarity(query, row_copy)
        candidates.append(row_copy)

    candidates.sort(key=lambda item: item["retrieval_score"], reverse=True)
    return candidates[:k_retrieve], pre_filtered_out
