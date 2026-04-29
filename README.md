# 🏥 Agentic Healthcare Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Bhashini](https://img.shields.io/badge/Translation-Bhashini-blue)](https://bhashini.gov.in/)

**It is an AI-powered healthcare intelligence platform designed to bridge the accessibility gap in rural India. By transforming thousands of unstructured facility records into a trust-scored, multi-lingual network, Jeevant empowers healthcare administrators and citizens to identify and navigate "medical deserts."

---

## 🌟 Key Features

- **🛡️ Evidence-Based Trust Scorer**: Every facility is ranked using a proprietary scoring engine with row-level traceability, ensuring reliability in critical healthcare decisions.
- **🗣️ Natural Language Multi-Lingual Search**: Powered by **Bhashini**, users can query the system in their native tongue (Hindi, Tamil, Marathi, etc.) and receive context-aware results.
- **🗺️ Interactive Healthcare Maps**: Visualizes facility density and "medical deserts" at the PIN-code level using MapLibre GL.
- **🧠 Agentic Reasoning Engine**: The system doesn't just return a list; it provides detailed reasoning on why a facility was recommended or rejected based on current capabilities.
- **🔍 Unstructured Data Extraction**: Automatically structures messy, fragmented facility data into actionable intelligence.

---

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS with modern aesthetics.
- **Maps**: MapLibre GL for high-performance geospatial visualization.
- **Language Support**: Integrated UI translation for localized experiences.

### Backend (FastAPI)
- **Logic Engine**: Python-based retrieval and ranking system.
- **Translation**: Deep integration with the Bhashini ecosystem.
- **Data Pipeline**: Custom extractors for unstructured facility records.
- **Search**: Hybrid retrieval-ranking model for high precision.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- API keys for Bhashini (configured in `.env`)

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the API server:
   ```bash
   uvicorn app:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Data & Intelligence

The system currently processes over **10,000 facility records**, analyzing attributes such as:
- Bed capacity and ICU availability.
- Specializations (Cardiology, Pediatrics, etc.).
- Geographical proximity and infrastructure quality.
- Service reliability and trust scores.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ to improve healthcare accessibility in Rural India.*
