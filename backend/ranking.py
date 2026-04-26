from __future__ import annotations

from typing import Any


def _requirement_coverage(requirements: dict[str, bool], caps: dict[str, str]) -> tuple[float, int, int]:
    checks: list[tuple[bool, bool]] = [
        (requirements["needs_surgery"], caps.get("surgery") in {"true", "partial"}),
        (requirements["needs_icu"], caps.get("icu") in {"true", "partial"}),
        (requirements["needs_emergency"], caps.get("availability") == "24/7"),
        (requirements["needs_dialysis"], caps.get("dialysis") in {"true", "partial"}),
    ]
    required = sum(1 for needed, _ in checks if needed)
    if required == 0:
        return 1.0, 0, 0
    met = sum(1 for needed, ok in checks if needed and ok)
    return met / required, met, required


def _reasoning(requirements: dict[str, bool], caps: dict[str, str], coverage: float) -> list[str]:
    lines: list[str] = []
    if requirements["needs_surgery"]:
        lines.append(
            "Supports surgery" if caps.get("surgery") in {"true", "partial"} else "Does not support required surgery"
        )
    if requirements["needs_icu"]:
        lines.append("ICU-capable" if caps.get("icu") in {"true", "partial"} else "ICU support not confirmed")
    if requirements["needs_emergency"]:
        lines.append("24/7 availability confirmed" if caps.get("availability") == "24/7" else "Emergency coverage limited")
    if requirements["needs_dialysis"]:
        lines.append("Dialysis capability detected" if caps.get("dialysis") in {"true", "partial"} else "Dialysis capability missing")
    lines.append(f"Requirement coverage: {round(coverage * 100)}%")
    return lines


def hard_filter_and_rank(
    candidates: list[dict[str, Any]],
    requirements: dict[str, bool],
    k_final: int = 3,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, int | float]]:
    kept: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []

    for row in candidates:
        caps = row["capabilities"]
        rejection_reasons: list[str] = []
        if requirements["needs_surgery"] and caps.get("surgery") == "false":
            rejection_reasons.append("Cannot perform surgery")
        if requirements["needs_icu"] and caps.get("icu") == "false":
            rejection_reasons.append("No ICU facility")
        if requirements["needs_dialysis"] and caps.get("dialysis") == "false":
            rejection_reasons.append("No dialysis capability")

        coverage, met, required = _requirement_coverage(requirements, caps)
        final_score = (
            (0.45 * float(row.get("trust_score", 0.0)))
            + (0.35 * float(row.get("retrieval_score", 0.0)))
            + (0.20 * coverage)
        )

        record = {
            "name": row.get("name", ""),
            "city": row.get("city", ""),
            "state": row.get("state", ""),
            "trust_score": round(float(row.get("trust_score", 0.0)), 3),
            "final_score": round(final_score, 3),
            "requirement_coverage": round(coverage, 3),
            "capabilities": caps,
            "reasoning": _reasoning(requirements, caps, coverage),
            "latitude": row.get("latitude"),
            "longitude": row.get("longitude"),
            "requirement_status": {"met": met, "required": required},
        }

        if rejection_reasons:
            rejected.append(
                {
                    "name": record["name"],
                    "city": record["city"],
                    "trust_score": record["trust_score"],
                    "final_score": record["final_score"],
                    "rejection_reason": rejection_reasons,
                }
            )
        else:
            kept.append(record)

    # If hard filtering rejects everything, fall back to best soft matches.
    if not kept:
        kept = sorted(
            [
                {
                    "name": row.get("name", ""),
                    "city": row.get("city", ""),
                    "state": row.get("state", ""),
                    "trust_score": round(float(row.get("trust_score", 0.0)), 3),
                    "final_score": round(
                        (0.5 * float(row.get("trust_score", 0.0))) + (0.5 * float(row.get("retrieval_score", 0.0))), 3
                    ),
                    "requirement_coverage": 0.0,
                    "capabilities": row["capabilities"],
                    "reasoning": ["No facility met all hard constraints; returning best available alternatives."],
                    "latitude": row.get("latitude"),
                    "longitude": row.get("longitude"),
                }
                for row in candidates
            ],
            key=lambda item: item["final_score"],
            reverse=True,
        )

    kept.sort(key=lambda item: item["final_score"], reverse=True)
    rejected.sort(key=lambda item: item["final_score"], reverse=True)

    metadata = {
        "hard_filtered": len(rejected),
        "final_candidates": len(kept),
        "coverage": round(len(kept) / max(1, len(candidates)), 4),
    }
    return kept[:k_final], rejected[:10], metadata
