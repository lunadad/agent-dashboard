const defaultData = {
  agents: [
    {
      id: "luna",
      name: "루나봇",
      role: "총괄 비서 · 오케스트레이터",
      mode: "MAIN",
      desc: "일정/복약/자동화/리포트를 총괄하고 머스쿠·커리나의 결과를 통합해 최종 브리핑을 전달합니다.",
      tags: ["스케줄", "복약", "통합 리포트", "메모리"],
      detail: "[최근 브리핑]\n- 오전 데일리 브리핑 발송\n- 복약 기록 동기화 완료\n- FT 원문 포워딩 자동화 점검 완료"
    },
    {
      id: "musku",
      name: "머스크",
      role: "투자 전략 · 시장 분석",
      mode: "SUB",
      desc: "FT/WSJ/NYT와 미국장 흐름을 빠르게 분석해 AMZN·INTC 중심으로 실행 가능한 투자 아이디어를 제시합니다.",
      tags: ["매크로", "주식", "리스크", "아이디어"],
      detail: "[최근 브리핑]\n- AMZN: AI 인프라 CapEx 이슈 추적\n- INTC: 공정/파트너십 모멘텀 점검\n- 오늘 밤 미국장 변동성 주의 권고"
    },
    {
      id: "kurina",
      name: "카리나",
      role: "아트 마켓 · 크리에이티브",
      mode: "SUB",
      desc: "Artnet/경매/전시 정보를 바탕으로 아트 브리핑을 큐레이션하고, 제품의 브랜드/UX 톤을 설계합니다.",
      tags: ["아트뉴스", "경매", "브랜드", "UX"],
      detail: "[최근 브리핑]\n- Artnet 최신 기사 4건 큐레이션\n- 중복 뉴스 제거 규칙 적용\n- 내일 전시/경매 관전 포인트 정리"
    }
  ],
  briefings: [
    { time: "08:00", headline: "FT 주요 뉴스 브리핑 원문 포워딩" },
    { time: "09:00", headline: "커리나 아트 브리핑 (최신 Artnet 중심)" },
    { time: "09:00", headline: "머스쿠 오전 시장 브리핑 (AMZN/INTC)" },
    { time: "21:00", headline: "머스쿠 저녁 시장 브리핑 (미국장 업데이트)" }
  ],
  timeline: [
    ["07:50", "지메일 체크 시작"],
    ["08:00", "FT 이메일 원문 전달"],
    ["09:00", "아트 + 주식 오전 브리핑 동시 발송"],
    ["21:00", "미국장 저녁 브리핑 발송"]
  ]
};

let state = structuredClone(defaultData);

async function loadData() {
  try {
    const res = await fetch("./data.json", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (json?.agents?.length) state = json;
  } catch {
    // fallback to defaultData
  }
}

function renderAgents() {
  const wrap = document.getElementById("agentCards");
  const tpl = document.getElementById("agentCardTemplate");
  wrap.innerHTML = "";

  state.agents.forEach((agent, idx) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".agent-card");
    card.dataset.id = agent.id;
    node.querySelector(".name").textContent = agent.name;
    node.querySelector(".role").textContent = agent.role;
    node.querySelector(".mode").textContent = agent.mode;
    node.querySelector(".desc").textContent = agent.desc;

    const tags = node.querySelector(".tags");
    agent.tags.forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      tags.appendChild(span);
    });

    wrap.appendChild(node);

    if (idx === 0) {
      queueMicrotask(() => {
        const first = wrap.querySelector(".agent-card");
        if (first) selectAgent(first, agent.detail);
      });
    }
  });

  wrap.querySelectorAll(".agent-card").forEach((el) => {
    el.addEventListener("click", () => {
      const agent = state.agents.find((a) => a.id === el.dataset.id);
      selectAgent(el, agent?.detail || "최근 브리핑 데이터가 없습니다.");
    });
  });
}

function selectAgent(cardEl, detailText) {
  document.querySelectorAll(".agent-card").forEach((c) => c.classList.remove("active"));
  cardEl.classList.add("active");
  document.getElementById("agentDetail").textContent = detailText;
}

function renderBriefings() {
  const ul = document.getElementById("briefingList");
  ul.innerHTML = "";
  state.briefings.forEach((b) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="time">${b.time}</span><div class="headline">${b.headline}</div>`;
    ul.appendChild(li);
  });
}

function renderTimeline() {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = "";
  state.timeline.forEach(([t, m]) => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `<div class="t">${t}</div><div class="m">${m}</div>`;
    wrap.appendChild(el);
  });
}

function renderDate() {
  const d = new Date();
  const dateText = `${d.getMonth() + 1}/${d.getDate()}`;
  document.getElementById("todayDate").textContent = dateText;
}

function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("agent-dashboard-theme");
  if (saved === "light") document.body.classList.add("light");

  const paint = () => {
    const isLight = document.body.classList.contains("light");
    btn.textContent = isLight ? "☀️ 라이트" : "🌙 다크";
  };

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("agent-dashboard-theme", isLight ? "light" : "dark");
    paint();
  });

  paint();
}

(async function init() {
  await loadData();
  renderDate();
  setupThemeToggle();
  renderAgents();
  renderBriefings();
  renderTimeline();
})();
