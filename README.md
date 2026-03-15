# Agent Dashboard

루나봇 · 머스크 · 카리나를 위한 로컬/웹 대시보드입니다.

![preview](https://img.shields.io/badge/status-live-22c55e)

## ✨ 기능

- 주인공 에이전트 3명 카드
  - **루나봇** (총괄 오케스트레이터)
  - **머스크** (투자/시장 분석)
  - **카리나** (아트/브랜드/UX)
- 좌측 사이드바에 **매일 브리핑 일정** 표시
- 카드 클릭 시 **상세 브리핑 패널** 표시
- **다크/라이트 테마 토글**
- `data.json` 기반 데이터 로딩(없으면 기본 데이터 fallback)

---

## 🌐 Live Demo

- GitHub Pages: https://lunadad.github.io/agent-dashboard/

## 📦 Repository

- GitHub: https://github.com/lunadad/agent-dashboard

---

## 🚀 로컬 실행

```bash
cd agent-dashboard
python3 -m http.server 8787
```

브라우저에서:

- http://localhost:8787

---

## 🗂️ 파일 구조

```text
agent-dashboard/
├── index.html
├── styles.css
├── script.js
├── data.json
└── README.md
```

---

## 🔧 커스터마이징

### 1) 에이전트/브리핑 내용 바꾸기

`data.json`만 수정하면 화면이 바로 바뀝니다.

- `agents`: 카드 정보 + 상세 브리핑
- `briefings`: 사이드바 브리핑 목록
- `timeline`: 하단 운영 타임라인

### 2) 테마

- 우측 상단 버튼으로 다크/라이트 전환
- 선택값은 브라우저 `localStorage`에 저장

---

## 📌 다음 확장 아이디어

- 크론 결과를 자동 반영하는 실시간 데이터 동기화
- 브리핑 검색/필터
- 알림센터 패널(읽음/안읽음)
- 브리핑 히스토리 아카이브

---

## License

MIT
