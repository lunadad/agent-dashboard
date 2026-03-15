# Agent Dashboard

<div align="center">

루나봇 · 머스크 · 카리나를 위한 브리핑 대시보드  
A lightweight command center for LunaBot, Musk, and Karina.

[![Live](https://img.shields.io/badge/Live-GitHub%20Pages-22c55e)](https://lunadad.github.io/agent-dashboard/)
[![Repo](https://img.shields.io/badge/GitHub-lunadad%2Fagent--dashboard-111827?logo=github)](https://github.com/lunadad/agent-dashboard)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Theme](https://img.shields.io/badge/Theme-Dark%2FLight-7c3aed)](#)

</div>

---

## 🌐 Links

- **Live Demo**: https://lunadad.github.io/agent-dashboard/
- **Repository**: https://github.com/lunadad/agent-dashboard

---

## 🇰🇷 한국어 소개

`Agent Dashboard`는 에이전트 3인(루나봇/머스크/카리나)의 역할, 브리핑, 운영 타임라인을 한 화면에서 보는 로컬/웹 대시보드입니다.

### 주요 기능

- **주인공 에이전트 카드 3개**
  - 루나봇 (총괄 오케스트레이터)
  - 머스크 (투자/시장 분석)
  - 카리나 (아트/브랜드/UX)
- **사이드바 일일 브리핑**
  - 08:00 FT 포워딩
  - 09:00 아트/주식 브리핑
  - 21:00 저녁 시장 브리핑
- **카드 클릭 상세 패널** (최근 브리핑 요약/원문)
- **다크/라이트 테마 토글**
- `data.json` 기반 데이터 바인딩 (fallback 포함)

---

## 🇺🇸 English Overview

`Agent Dashboard` is a lightweight local/web dashboard that visualizes:

- three hero agents (LunaBot, Musk, Karina),
- daily briefing sidebar,
- clickable agent detail panel,
- operation timeline,
- dark/light theme toggle.

Data is loaded from `data.json` with graceful fallback.

---

## 🚀 Run Locally

```bash
cd agent-dashboard
python3 -m http.server 8787
```

Open:

- http://localhost:8787

---

## 🗂️ Project Structure

```text
agent-dashboard/
├── index.html
├── styles.css
├── script.js
├── data.json
└── README.md
```

---

## 🔧 Customization

Edit **`data.json`** only:

- `agents`: card profile + detail panel text
- `briefings`: sidebar briefing list
- `timeline`: operation timeline rows

Theme preference is stored in browser `localStorage`.

---

## 🧪 Roadmap Ideas

- Auto-sync from cron outputs to `data.json`
- Briefing search/filter
- Notification center (read/unread)
- Historical briefing archive
- Mini chart panel (market + art sentiment)

---

## License

MIT
