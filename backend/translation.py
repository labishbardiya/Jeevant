from __future__ import annotations

import json
import logging
import os
import urllib.error
import urllib.request
from functools import lru_cache

logger = logging.getLogger(__name__)


def _post_json(url: str, payload: dict, headers: dict[str, str]) -> dict:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url=url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(request, timeout=8) as response:
        raw = response.read().decode("utf-8")
        return json.loads(raw)


def _extract_translation(response: dict) -> str | None:
    for task in response.get("pipelineResponse", []):
        if task.get("taskType") != "translation":
            continue
        output = task.get("output") or []
        if output and isinstance(output[0], dict):
            target = output[0].get("target")
            if isinstance(target, str) and target.strip():
                return target.strip()
    return None


class BhashiniTranslator:
    def __init__(self) -> None:
        self.compute_url = os.getenv("BHASHINI_COMPUTE_URL", "").strip()
        self.translation_service_id = os.getenv("BHASHINI_TRANSLATION_SERVICE_ID", "").strip()
        self.api_key = os.getenv("BHASHINI_API_KEY", "").strip()
        self.client_id = os.getenv("BHASHINI_CLIENT_ID", "").strip()
        self.user_id = os.getenv("BHASHINI_USER_ID", "").strip()

    def is_enabled(self) -> bool:
        return bool(self.compute_url and self.translation_service_id and self.api_key)

    @lru_cache(maxsize=512)
    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        if not text or source_lang == target_lang:
            return text
        if not self.is_enabled():
            return text

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {"sourceLanguage": source_lang, "targetLanguage": target_lang},
                        "serviceId": self.translation_service_id,
                    },
                }
            ],
            "inputData": {"input": [{"source": text}]},
        }
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "ulcaApiKey": self.api_key,
            "Authorization": self.api_key,
            "userID": self.user_id or self.client_id,
        }
        try:
            response = _post_json(self.compute_url, payload, headers)
            translated = _extract_translation(response)
            return translated or text
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError, ValueError):
            logger.exception("Bhashini translation call failed")
            return text
