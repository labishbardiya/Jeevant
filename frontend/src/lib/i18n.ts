export type AppLanguage = {
  code: string;
  label: string;
  speechLocale: string;
};

export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  { code: "en", label: "English", speechLocale: "en-IN" },
  { code: "hi", label: "Hindi", speechLocale: "hi-IN" },
  { code: "bn", label: "Bengali", speechLocale: "bn-IN" },
  { code: "ta", label: "Tamil", speechLocale: "ta-IN" },
  { code: "te", label: "Telugu", speechLocale: "te-IN" },
  { code: "mr", label: "Marathi", speechLocale: "mr-IN" },
  { code: "gu", label: "Gujarati", speechLocale: "gu-IN" },
  { code: "kn", label: "Kannada", speechLocale: "kn-IN" },
  { code: "ml", label: "Malayalam", speechLocale: "ml-IN" },
  { code: "pa", label: "Punjabi", speechLocale: "pa-IN" },
  { code: "or", label: "Odia", speechLocale: "or-IN" },
  { code: "as", label: "Assamese", speechLocale: "as-IN" },
  { code: "ur", label: "Urdu", speechLocale: "ur-IN" },
  { code: "sd", label: "Sindhi", speechLocale: "sd-IN" },
  { code: "ne", label: "Nepali", speechLocale: "ne-NP" },
  { code: "sa", label: "Sanskrit", speechLocale: "hi-IN" },
  { code: "mai", label: "Maithili", speechLocale: "hi-IN" },
  { code: "bho", label: "Bhojpuri", speechLocale: "hi-IN" },
  { code: "doi", label: "Dogri", speechLocale: "hi-IN" },
  { code: "kok", label: "Konkani", speechLocale: "hi-IN" },
  { code: "mni", label: "Manipuri", speechLocale: "bn-IN" },
  { code: "ks", label: "Kashmiri", speechLocale: "ur-IN" },
];

export const EN_TEXT = {
  appTitle: "Jeevant",
  appSubtitle: "Healthcare Intelligence System",
  searchPlaceholder: "Emergency surgery hospital Jaipur",
  searchButton: "Search",
  analyzingButton: "Analyzing...",
  topResults: "Top Results",
  runQueryHint: "Run a query to view top ranked facilities.",
  whyNot: "Why Not",
  noRejected: "No rejected facilities were returned for this query.",
  map: "Map",
  debugPanel: "Debug Panel",
  query: "Query",
  requirements: "Requirements",
  metadata: "Metadata",
  requirementCoverage: "Requirement coverage",
  trustScore: "Trust score",
  finalScore: "Final",
  apiError: "Unable to reach the healthcare intelligence API. Please retry.",
  noMatch: "No matching facilities found.",
  micStart: "Start voice input",
  micListening: "Listening...",
  micUnsupported: "Speech input is not supported on this browser.",
};

const HI_TEXT: typeof EN_TEXT = {
  appTitle: "जीवंत",
  appSubtitle: "हेल्थकेयर इंटेलिजेंस सिस्टम",
  searchPlaceholder: "जयपुर में इमरजेंसी सर्जरी अस्पताल",
  searchButton: "खोजें",
  analyzingButton: "विश्लेषण हो रहा है...",
  topResults: "शीर्ष परिणाम",
  runQueryHint: "शीर्ष रैंक सुविधाएँ देखने के लिए क्वेरी चलाएँ।",
  whyNot: "क्यों नहीं",
  noRejected: "इस क्वेरी के लिए कोई अस्वीकृत सुविधा नहीं मिली।",
  map: "मानचित्र",
  debugPanel: "डीबग पैनल",
  query: "क्वेरी",
  requirements: "आवश्यकताएँ",
  metadata: "मेटाडेटा",
  requirementCoverage: "आवश्यकता कवरेज",
  trustScore: "ट्रस्ट स्कोर",
  finalScore: "अंतिम",
  apiError: "हेल्थकेयर API तक पहुँचना संभव नहीं है। कृपया पुनः प्रयास करें।",
  noMatch: "कोई उपयुक्त सुविधा नहीं मिली।",
  micStart: "वॉइस इनपुट शुरू करें",
  micListening: "सुन रहे हैं...",
  micUnsupported: "इस ब्राउज़र में स्पीच इनपुट समर्थित नहीं है।",
};

const UI_TEXTS: Record<string, typeof EN_TEXT> = {
  en: EN_TEXT,
  hi: HI_TEXT,
};

export function getText(languageCode: string): typeof EN_TEXT {
  return UI_TEXTS[languageCode] ?? EN_TEXT;
}

export type UIText = typeof EN_TEXT;
export const UI_TEXT_KEYS = Object.keys(EN_TEXT) as Array<keyof UIText>;
