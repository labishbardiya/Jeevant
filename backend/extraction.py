from __future__ import annotations

from typing import Any


def extract_facility(row: dict[str, Any]) -> dict[str, Any]:
    structured = dict(row.get("structured") or {})
    if not structured:
        structured = {
            "icu": "unknown",
            "surgery": "unknown",
            "oxygen": "unknown",
            "anesthesiologist": "unknown",
            "availability": "unknown",
            "dialysis": "unknown",
        }

    # Medical safety rule: if ICU is present, oxygen should not remain unknown.
    if structured.get("icu") in {"true", "partial"} and structured.get("oxygen") == "unknown":
        structured["oxygen"] = "true"

    return {"structured": structured}
