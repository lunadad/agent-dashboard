const AGENT_COLORS = {
  luna: { gradient: "linear-gradient(135deg, #38bdf8, #6366f1)", initial: "L" },
  musku: { gradient: "linear-gradient(135deg, #34d399, #059669)", initial: "M" },
  kurina: { gradient: "linear-gradient(135deg, #c084fc, #7c3aed)", initial: "K" },
};

const DEFAULT_STATUSES = { luna: "working", musku: "working", kurina: "idle" };

const FILTER_CATEGORIES = [
  { label: "전체", keywords: null },
  { label: "투자", keywords: ["FT", "투자", "AMZN", "INTC", "시장", "주식", "인사이트"] },
  { label: "아트", keywords: ["아트", "Artnet", "경매", "전시", "카리나"] },
  { label: "운영", keywords: ["복약", "리마인더", "체크"] },
];

const REFRESH_INTERVAL = 60_000;

const defaultData = {
  agents: [
    {
      id: "luna",
      name: "루나봇",
      role: "총괄 비서 · 오케스트레이터",
      mode: "MAIN",
      desc: "일정/복약/자동화/리포트를 총괄하고 머스크·카리나의 결과를 통합해 최종 브리핑을 전달합니다.",
      tags: ["스케줄", "복약", "통합 리포트", "메모리"],
      detail: "[최근 브리핑]\n- 오전 데일리 브리핑 발송\n- 복약 기록 동기화 완료\n- FT 원문 포워딩 자동화 점검 완료",
    },
    {
      id: "musku",
      name: "머스크",
      role: "투자 전략 · 시장 분석",
      mode: "SUB",
      desc: "FT/WSJ/NYT와 미국장 흐름을 빠르게 분석해 AMZN·INTC 중심으로 실행 가능한 투자 아이디어를 제시합니다.",
      tags: ["매크로", "주식", "리스크", "아이디어"],
      detail: "[최근 브리핑]\n- AMZN: AI 인프라 CapEx 이슈 추적\n- INTC: 공정/파트너십 모멘텀 점검\n- 오늘 밤 미국장 변동성 주의 권고",
    },
    {
      id: "kurina",
      name: "카리나",
      role: "아트 마켓 · 크리에이티브",
      mode: "SUB",
      desc: "Artnet/경매/전시 정보를 바탕으로 아트 브리핑을 큐레이션하고, 제품의 브랜드/UX 톤을 설계합니다.",
      tags: ["아트뉴스", "경매", "브랜드", "UX"],
      detail: "[최근 브리핑]\n- Artnet 최신 기사 4건 큐레이션\n- 중복 뉴스 제거 규칙 적용\n- 내일 전시/경매 관전 포인트 정리",
    },
  ],
  briefings: [
    { time: "08:00", headline: "FT 주요 뉴스 브리핑 원문 포워딩" },
    { time: "08:05", headline: "FT 후속 투자 인사이트 (한국 종목 연결)" },
    { time: "09:00", headline: "카리나 아트 브리핑 (최신 Artnet 중심)" },
    { time: "09:00", headline: "머스크 오전 시장 브리핑 (AMZN/INTC)" },
    { time: "21:00", headline: "머스크 저녁 시장 브리핑 (미국장 업데이트)" },
  ],
  notices: [
    { time: "09:30", headline: "복약 누락 체크 리마인더 활성화" },
    { time: "08:00", headline: "FT 원문 + 08:05 인사이트 2단 전송 활성화" },
  ],
  quality: [
    ["최신성", "92 / 100"],
    ["중복도", "중복 낮음 (Good)"],
    ["실행가능성", "89 / 100"],
  ],
  sources: [
    ["FT", "원문 포워딩 · 08:00"],
    ["Artnet", "아트 브리핑 · 09:00"],
    ["NYSE/Nasdaq News", "주식 브리핑 · 09:00/21:00"],
  ],
  timeline: [
    ["07:50", "지메일 체크 시작"],
    ["08:00", "FT 이메일 원문 전달"],
    ["08:05", "FT 후속 투자 인사이트 전달"],
    ["09:00", "아트 + 주식 오전 브리핑 동시 발송"],
    ["09:30", "복약 누락 여부 자동 체크"],
    ["21:00", "미국장 저녁 브리핑 발송"],
  ],
};

let state = structuredClone(defaultData);
let activeFilter = "전체";
let selectedAgentIdx = 0;

// ── Data loading ──

async function loadData() {
  try {
    const res = await fetch("./data.json", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (json?.agents?.length) state = { ...defaultData, ...json };
  } catch {
    // fallback to defaultData
  }
}

// ── Time helpers ──

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getNowMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

// ── Render: Agents ──

function renderAgents() {
  const wrap = document.getElementById("agentCards");
  const tpl = document.getElementById("agentCardTemplate");
  wrap.innerHTML = "";

  state.agents.forEach((agent, idx) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".agent-card");
    card.dataset.id = agent.id;
    card.setAttribute("aria-label", `${agent.name} - ${agent.role}`);
    node.querySelector(".name").textContent = agent.name;
    node.querySelector(".role").textContent = agent.role;
    node.querySelector(".mode").textContent = agent.mode;
    node.querySelector(".desc").textContent = agent.desc;

    // Avatar with initial
    const avatarInitial = node.querySelector(".avatar-initial");
    const agentColor = AGENT_COLORS[agent.id];
    if (agentColor) avatarInitial.textContent = agentColor.initial;

    // Agent status dot
    const statusDot = node.querySelector(".agent-status-dot");
    const agentStatus = agent.status || DEFAULT_STATUSES[agent.id] || "idle";
    statusDot.classList.add(agentStatus);
    statusDot.setAttribute("aria-label", agentStatus);

    // Tags (safe DOM creation)
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

  // Click + keyboard listeners
  wrap.querySelectorAll(".agent-card").forEach((el, idx) => {
    el.addEventListener("click", () => {
      const agent = state.agents.find((a) => a.id === el.dataset.id);
      selectedAgentIdx = idx;
      selectAgent(el, agent?.detail || "최근 브리핑 데이터가 없습니다.");
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });
}

function selectAgent(cardEl, detailText) {
  document.querySelectorAll(".agent-card").forEach((c) => {
    c.classList.remove("active");
    c.setAttribute("aria-selected", "false");
  });
  cardEl.classList.add("active");
  cardEl.setAttribute("aria-selected", "true");
  renderDetail(detailText);
}

// ── Render: Detail (markdown-like) ──

function renderDetail(text) {
  const el = document.getElementById("agentDetail");
  el.innerHTML = "";

  const lines = text.split("\n");
  let ul = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Heading: [Something]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      if (ul) { el.appendChild(ul); ul = null; }
      const heading = document.createElement("div");
      heading.className = "detail-heading";
      heading.textContent = trimmed.slice(1, -1);
      el.appendChild(heading);
      return;
    }

    // List item: - Something
    if (trimmed.startsWith("- ")) {
      if (!ul) ul = document.createElement("ul");
      const li = document.createElement("li");
      li.textContent = trimmed.slice(2);
      ul.appendChild(li);
      return;
    }

    // Plain text
    if (ul) { el.appendChild(ul); ul = null; }
    const p = document.createElement("p");
    p.textContent = trimmed;
    p.style.margin = "4px 0";
    p.style.fontSize = "13px";
    el.appendChild(p);
  });

  if (ul) el.appendChild(ul);
}

// ── Render: Briefing list (XSS-safe) ──

function renderList(targetId, items) {
  const ul = document.getElementById(targetId);
  ul.innerHTML = "";
  const now = getNowMinutes();
  let nextFound = false;

  items.forEach((b) => {
    const li = document.createElement("li");
    const timeSpan = document.createElement("span");
    timeSpan.className = "time";
    timeSpan.textContent = b.time;
    const headlineDiv = document.createElement("div");
    headlineDiv.className = "headline";
    headlineDiv.textContent = b.headline;
    li.appendChild(timeSpan);
    li.appendChild(headlineDiv);

    // Time-based highlighting
    if (targetId === "briefingList") {
      const bMin = timeToMinutes(b.time);
      if (bMin < now) {
        li.classList.add("past");
      } else if (!nextFound) {
        li.classList.add("next");
        nextFound = true;
      }
    }

    ul.appendChild(li);
  });
}

// ── Render: Quality board (progress bars) ──

function renderQuality(rows) {
  const wrap = document.getElementById("qualityBoard");
  wrap.innerHTML = "";

  rows.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "quality-item";

    // Try to parse numeric score
    const numMatch = value.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (numMatch) {
      const score = parseInt(numMatch[1], 10);
      const max = parseInt(numMatch[2], 10);
      const pct = Math.round((score / max) * 100);

      const labelRow = document.createElement("div");
      labelRow.className = "quality-label";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = label;
      const valSpan = document.createElement("span");
      valSpan.className = "val";
      valSpan.textContent = value;
      labelRow.appendChild(nameSpan);
      labelRow.appendChild(valSpan);

      const track = document.createElement("div");
      track.className = "progress-track";
      const fill = document.createElement("div");
      fill.className = "progress-fill";
      fill.classList.add(pct >= 80 ? "high" : pct >= 50 ? "mid" : "low");
      fill.style.width = "0%";
      track.appendChild(fill);

      item.appendChild(labelRow);
      item.appendChild(track);

      // Animate after append
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { fill.style.width = pct + "%"; });
      });
    } else {
      // Non-numeric: text display
      const labelRow = document.createElement("div");
      labelRow.className = "quality-label";
      const nameSpan = document.createElement("span");
      nameSpan.textContent = label;
      labelRow.appendChild(nameSpan);

      const textEl = document.createElement("div");
      textEl.className = "quality-text";
      textEl.textContent = value;

      item.appendChild(labelRow);
      item.appendChild(textEl);
    }

    wrap.appendChild(item);
  });
}

// ── Render: Source matrix (XSS-safe) ──

function renderMatrix(targetId, rows) {
  const wrap = document.getElementById(targetId);
  wrap.innerHTML = "";

  rows.forEach(([t, m]) => {
    const el = document.createElement("div");
    el.className = "item";
    const tDiv = document.createElement("div");
    tDiv.className = "t";
    tDiv.textContent = t;
    const mDiv = document.createElement("div");
    mDiv.className = "m";
    mDiv.textContent = m;
    el.appendChild(tDiv);
    el.appendChild(mDiv);
    wrap.appendChild(el);
  });
}

// ── Render: Visual Timeline ──

function renderTimeline(rows) {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = "";
  const now = getNowMinutes();

  let currentIdx = -1;
  rows.forEach(([time], i) => {
    if (timeToMinutes(time) <= now) currentIdx = i;
  });

  rows.forEach(([time, label], i) => {
    const item = document.createElement("div");
    item.className = "tl-item";

    if (i < currentIdx) item.classList.add("past");
    else if (i === currentIdx) item.classList.add("current");
    else item.classList.add("future");

    // Dot + line
    const dotWrap = document.createElement("div");
    dotWrap.className = "tl-dot-wrap";
    const dot = document.createElement("div");
    dot.className = "tl-dot";
    const line = document.createElement("div");
    line.className = "tl-line";
    dotWrap.appendChild(dot);
    dotWrap.appendChild(line);

    // Time
    const timeEl = document.createElement("div");
    timeEl.className = "tl-time";
    timeEl.textContent = time;

    // Label
    const labelEl = document.createElement("div");
    labelEl.className = "tl-label";
    labelEl.textContent = label;

    item.appendChild(dotWrap);
    item.appendChild(timeEl);
    item.appendChild(labelEl);
    wrap.appendChild(item);
  });
}

// ── Briefing search ──

function getFilteredBriefings(query) {
  let items = state.briefings;

  // Category filter
  if (activeFilter !== "전체") {
    const cat = FILTER_CATEGORIES.find((c) => c.label === activeFilter);
    if (cat?.keywords) {
      items = items.filter((b) =>
        cat.keywords.some((kw) => b.headline.toLowerCase().includes(kw.toLowerCase()))
      );
    }
  }

  // Text search
  if (query) {
    items = items.filter((b) =>
      `${b.time} ${b.headline}`.toLowerCase().includes(query)
    );
  }

  return items;
}

function setupBriefingSearch() {
  const input = document.getElementById("briefingSearch");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    renderList("briefingList", getFilteredBriefings(q));
  });
}

// ── Category filter ──

function renderFilters() {
  const row = document.getElementById("filterRow");
  row.innerHTML = "";

  FILTER_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat.label;
    if (cat.label === activeFilter) btn.classList.add("active");

    btn.addEventListener("click", () => {
      activeFilter = cat.label;
      row.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const q = document.getElementById("briefingSearch").value.trim().toLowerCase();
      renderList("briefingList", getFilteredBriefings(q));
    });

    row.appendChild(btn);
  });
}

// ── Notice badge ──

function renderNoticeBadge() {
  const badge = document.getElementById("noticeBadge");
  const count = (state.notices || []).length;
  badge.textContent = count;
}

// ── Date display ──

function renderDate() {
  const d = new Date();
  const dateText = `${d.getMonth() + 1}/${d.getDate()}`;
  document.getElementById("todayDate").textContent = dateText;
}

// ── Theme toggle with OS preference ──

function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("agent-dashboard-theme");

  // Apply saved or OS preference
  if (saved === "light") {
    document.body.classList.add("light");
  } else if (!saved && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  }

  const paint = () => {
    const isLight = document.body.classList.contains("light");
    btn.textContent = isLight ? "라이트" : "다크";
  };

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("agent-dashboard-theme", isLight ? "light" : "dark");
    paint();
  });

  paint();
}

// ── Keyboard navigation ──

function setupKeyboardNav() {
  document.addEventListener("keydown", (e) => {
    // "/" to focus search
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      document.getElementById("briefingSearch").focus();
    }

    // Arrow keys for agent cards
    const cards = [...document.querySelectorAll(".agent-card")];
    if (!cards.length) return;

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const dir = e.key === "ArrowRight" ? 1 : -1;
      selectedAgentIdx = (selectedAgentIdx + dir + cards.length) % cards.length;
      cards[selectedAgentIdx].click();
      cards[selectedAgentIdx].focus();
    }
  });
}

// ── Auto-refresh ──

function setupAutoRefresh() {
  setInterval(async () => {
    const prev = JSON.stringify(state);
    await loadData();
    if (JSON.stringify(state) !== prev) {
      renderAll();
    }
  }, REFRESH_INTERVAL);
}

// ── Skeleton → content transition ──

function showContent() {
  const skeleton = document.getElementById("skeletonLoader");
  const content = document.getElementById("mainContent");
  if (skeleton) skeleton.style.display = "none";
  if (content) content.classList.add("loaded");
}

// ── Render all ──

function renderAll() {
  renderDate();
  renderAgents();
  renderFilters();
  renderList("briefingList", getFilteredBriefings(""));
  renderList("noticeList", state.notices || []);
  renderNoticeBadge();
  renderQuality(state.quality || []);
  renderMatrix("sourceBoard", state.sources || []);
  renderTimeline(state.timeline || []);
}

// ── Init ──

(async function init() {
  try {
    await loadData();
  } catch {
    // fallback to defaultData – already set
  }

  try {
    setupThemeToggle();
    renderAll();
    setupBriefingSearch();
    setupKeyboardNav();
  } catch (err) {
    console.error("[Agent Dashboard] render error:", err);
  } finally {
    // Always show content – never leave the page blank
    showContent();
  }

  setupAutoRefresh();
})();
