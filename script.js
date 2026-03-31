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

const MODEL_COLORS = {
  "google/gemini-3.1-flash-lite": "#38bdf8",
  "google/gemini-3.1-pro": "#a78bfa",
  "google/gemini-3-flash-preview": "#34d399",
  "openai-codex/gpt-5.3-codex": "#f59e0b",
  "default": "#94a3b8"
};

const defaultData = {
  agents: [
    {
      id: "luna",
      name: "루나봇",
      role: "총괄 비서 · 오케스트레이터",
      model: "google/gemini-3.1-flash-lite",
      mode: "MAIN",
      desc: "일정/복약/자동화/리포트를 총괄하고 머스크·카리나의 결과를 통합해 최종 브리핑을 전달합니다.",
      tags: ["스케줄", "복약", "통합 리포트", "메모리"],
      detail: "[최근 브리핑]\n- 오전 데일리 브리핑 발송\n- 복약 기록 동기화 완료\n- FT 원문 포워딩 자동화 점검 완료",
      avatar: "./assets/luna.jpg"
    },
    {
      id: "musku",
      name: "머스크",
      role: "투자 전략 · 시장 분석",
      model: "google/gemini-3.1-flash-lite",
      mode: "SUB",
      desc: "FT/WSJ/NYT와 미국장 흐름을 빠르게 분석해 AMZN·INTC 중심으로 실행 가능한 투자 아이디어를 제시합니다.",
      tags: ["매크로", "주식", "리스크", "아이디어"],
      detail: "[최근 브리핑]\n- AMZN: AI 인프라 CapEx 이슈 추적\n- INTC: 공정/파트너십 모멘텀 점검\n- 오늘 밤 미국장 변동성 주의 권고",
      avatar: "./assets/musk.png",
    },
    {
      id: "kurina",
      name: "카리나",
      role: "아트 마켓 · 크리에이티브",
      model: "google/gemini-3.1-pro",
      mode: "SUB",
      desc: "Artnet/경매/전시 정보를 바탕으로 아트 브리핑을 큐레이션하고, 제품의 브랜드/UX 톤을 설계합니다.",
      tags: ["아트뉴스", "경매", "브랜드", "UX"],
      detail: "[최근 브리핑]\n- Artnet 최신 기사 4건 큐레이션\n- 중복 뉴스 제거 규칙 적용\n- 내일 전시/경매 관전 포인트 정리",
      avatar: "./assets/karina.jpg",
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
  costMonitoring: {
    currency: "USD",
    updatedAt: "-",
    budgetDailyUsd: 1.5,
    budgetMonthlyUsd: 35,
    budgetDailyTokens: 400000,
    budgetMonthlyTokens: 9000000,
    byAgent: [
      {
        agent: "루나봇",
        dailyUsd: 0.18,
        monthlyUsd: 4.2,
        dailyTokens: 32000,
        monthlyTokens: 780000,
        calls: 34,
        models: [
          { name: "google/gemini-3.1-flash-lite", tokens: 22000 },
          { name: "openai-codex/gpt-5.3-codex", tokens: 10000 }
        ]
      },
      {
        agent: "카리나",
        dailyUsd: 0.27,
        monthlyUsd: 7.8,
        dailyTokens: 51000,
        monthlyTokens: 1220000,
        calls: 21,
        models: [
          { name: "google/gemini-3.1-pro", tokens: 34000 },
          { name: "google/gemini-3.1-flash-lite", tokens: 17000 }
        ]
      },
      {
        agent: "머스크",
        dailyUsd: 0.23,
        monthlyUsd: 6.5,
        dailyTokens: 43000,
        monthlyTokens: 1010000,
        calls: 26,
        models: [
          { name: "google/gemini-3.1-flash-lite", tokens: 28000 },
          { name: "google/gemini-3-flash-preview", tokens: 15000 }
        ]
      }
    ]
  },
  timeline: [
    ["07:50", "지메일 체크 시작"],
    ["08:00", "FT 이메일 원문 전달"],
    ["08:05", "FT 후속 투자 인사이트 전달"],
    ["09:00", "아트 + 주식 오전 브리핑 동시 발송"],
    ["09:30", "복약 누락 여부 자동 체크"],
    ["21:00", "미국장 저녁 브리핑 발송"],
  ],
  dailyReports: [
    {
      time: "08:00",
      agent: "루나봇",
      title: "FT 원문 포워딩",
      content: "오늘 도착한 FT 주요 뉴스 브리핑 원문을 그대로 전달했습니다."
    },
    {
      time: "09:00",
      agent: "카리나",
      title: "아트 브리핑",
      content: "Artnet 최신 기사 4건을 신규도 점수와 함께 브리핑했습니다. 출처 링크를 포함하고, 중복 주제는 제외했습니다."
    }
  ]
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

function getAgentCurrentTask(agent) {
  if (agent.currentTask) return agent.currentTask;
  if (!agent.detail) return "현재 작업 정보 없음";
  const line = agent.detail
    .split("\n")
    .map((s) => s.trim())
    .find((s) => s.startsWith("- "));
  return line ? line.replace(/^-\s*/, "") : "현재 작업 정보 없음";
}

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
    node.querySelector(".model").textContent = `model: ${agent.model || 'default'}`;
    node.querySelector(".mode").textContent = agent.mode;
    node.querySelector(".desc").textContent = agent.desc;

    const taskBtn = node.querySelector(".task-btn");
    const currentTask = getAgentCurrentTask(agent);
    taskBtn.textContent = `🛠 ${currentTask}`;
    taskBtn.title = currentTask;

    // Avatar with optional image + fallback initial
    const avatarEl = node.querySelector(".avatar");
    const avatarInitial = node.querySelector(".avatar-initial");
    const agentColor = AGENT_COLORS[agent.id];
    if (agent.avatar) {
      avatarEl.style.backgroundImage = `url('${agent.avatar}')`;
      avatarEl.classList.add("has-img");
      if (avatarInitial) avatarInitial.textContent = "";
    } else if (agentColor && avatarInitial) {
      avatarInitial.textContent = agentColor.initial;
    }

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

function setDockActive(agentId) {
  document.querySelectorAll(".dock-item").forEach((d) => d.classList.toggle("active", d.dataset.id === agentId));
}

function selectAgent(cardEl, detailText) {
  document.querySelectorAll(".agent-card").forEach((c) => {
    c.classList.remove("active");
    c.setAttribute("aria-selected", "false");
  });
  cardEl.classList.add("active");
  cardEl.setAttribute("aria-selected", "true");
  setDockActive(cardEl.dataset.id);
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

function renderCostBoard(cost) {
  const wrap = document.getElementById("costBoard");
  if (!wrap) return;
  wrap.innerHTML = "";

  const currency = cost?.currency || "USD";
  const rows = cost?.byAgent || [];

  const totalDailyUsd = rows.reduce((s, r) => s + (Number(r.dailyUsd ?? r.daily) || 0), 0);
  const totalMonthlyUsd = rows.reduce((s, r) => s + (Number(r.monthlyUsd ?? r.monthly) || 0), 0);
  const totalDailyTokens = rows.reduce((s, r) => s + (Number(r.dailyTokens) || 0), 0);
  const totalMonthlyTokens = rows.reduce((s, r) => s + (Number(r.monthlyTokens) || 0), 0);

  const budgetDailyUsd = Number((cost?.budgetDailyUsd ?? cost?.budgetDaily) || 0);
  const budgetMonthlyUsd = Number((cost?.budgetMonthlyUsd ?? cost?.budgetMonthly) || 0);
  const budgetDailyTokens = Number(cost?.budgetDailyTokens || 0);
  const budgetMonthlyTokens = Number(cost?.budgetMonthlyTokens || 0);

  const summary = document.createElement("div");
  summary.className = "cost-summary";
  summary.innerHTML = `
    <div><strong>일간 토큰</strong> ${totalDailyTokens.toLocaleString()} / ${budgetDailyTokens ? budgetDailyTokens.toLocaleString() : "-"}</div>
    <div><strong>월간 토큰</strong> ${totalMonthlyTokens.toLocaleString()} / ${budgetMonthlyTokens ? budgetMonthlyTokens.toLocaleString() : "-"}</div>
    <div><strong>일간 비용</strong> ${currency} ${totalDailyUsd.toFixed(2)} / ${budgetDailyUsd ? budgetDailyUsd.toFixed(2) : "-"}</div>
    <div><strong>월간 비용</strong> ${currency} ${totalMonthlyUsd.toFixed(2)} / ${budgetMonthlyUsd ? budgetMonthlyUsd.toFixed(2) : "-"}</div>
    <div><strong>업데이트</strong> ${cost?.updatedAt || "-"}</div>
  `;
  wrap.appendChild(summary);

  rows.forEach((r) => {
    const item = document.createElement("div");
    item.className = "cost-item";

    const dailyTokens = Number(r.dailyTokens) || 0;
    const models = Array.isArray(r.models) && r.models.length
      ? r.models
      : [{ name: r.model || "default", tokens: dailyTokens }];

    item.innerHTML = `
      <div class="cost-head"><span>${r.agent}</span><span>${dailyTokens.toLocaleString()} tokens/day</span></div>
      <div class="cost-sub">월 ${ (Number(r.monthlyTokens)||0).toLocaleString()} tokens · ${currency} ${(Number(r.monthlyUsd ?? r.monthly)||0).toFixed(2)} · 호출 ${Number(r.calls)||0}회</div>
    `;

    const bar = document.createElement("div");
    bar.className = "model-bar";

    const legend = document.createElement("div");
    legend.className = "model-legend";

    const denom = models.reduce((s, m) => s + (Number(m.tokens) || 0), 0) || 1;

    models.forEach((m) => {
      const t = Number(m.tokens) || 0;
      const pct = Math.max(2, Math.round((t / denom) * 100));
      const seg = document.createElement("div");
      seg.className = "model-seg";
      seg.style.width = `${pct}%`;
      seg.style.background = MODEL_COLORS[m.name] || MODEL_COLORS.default;
      seg.title = `${m.name}: ${t.toLocaleString()} tokens`;
      bar.appendChild(seg);

      const chip = document.createElement("span");
      chip.className = "model-chip";
      chip.innerHTML = `<i style="background:${MODEL_COLORS[m.name] || MODEL_COLORS.default}"></i>${m.name} · ${t.toLocaleString()}`;
      legend.appendChild(chip);
    });

    item.appendChild(bar);
    item.appendChild(legend);
    wrap.appendChild(item);
  });
}

// ── Render: Visual Timeline ──

function compressTimelineRows(rows) {
  const refreshKey = "데이터 대시보드 자동 갱신";
  const refreshRows = rows.filter(([, label]) => String(label || "").includes(refreshKey));
  const normalRows = rows.filter(([, label]) => !String(label || "").includes(refreshKey));

  if (!refreshRows.length) return rows;

  const latest = refreshRows[refreshRows.length - 1][0];
  const summarized = [latest, `${refreshKey} × ${refreshRows.length}회 (중복 묶음)`];

  const merged = [...normalRows];
  const insertAt = Math.max(0, rows.findIndex(([t, l]) => t === latest && String(l || "").includes(refreshKey)));
  merged.splice(insertAt, 0, summarized);
  return merged;
}

function renderTimeline(rows) {
  const wrap = document.getElementById("timeline");
  wrap.innerHTML = "";

  const compactRows = compressTimelineRows(rows || []);
  const now = getNowMinutes();

  let currentIdx = -1;
  compactRows.forEach(([time], i) => {
    if (timeToMinutes(time) <= now) currentIdx = i;
  });

  compactRows.forEach(([time, label], i) => {
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

function renderDock() {
  const dock = document.getElementById("agentDock");
  if (!dock) return;
  dock.innerHTML = "";

  state.agents.forEach((agent) => {
    const status = agent.status || DEFAULT_STATUSES[agent.id] || "idle";
    const label = status === "working" ? "작업중" : "대기";

    const item = document.createElement("button");
    item.className = "dock-item";
    item.dataset.id = agent.id;
    item.setAttribute("aria-label", `${agent.name} 도크 버튼`);

    const bubble = document.createElement("div");
    bubble.className = "dock-bubble";
    const currentTask = getAgentCurrentTask(agent);
    bubble.textContent = `${agent.name} · ${label} · ${currentTask}`;

    const avatar = document.createElement("div");
    avatar.className = "dock-avatar";
    if (agent.avatar) {
      avatar.style.backgroundImage = `url('${agent.avatar}')`;
    } else {
      avatar.style.background = AGENT_COLORS[agent.id]?.gradient || "linear-gradient(135deg,#38bdf8,#6366f1)";
    }

    const statusEl = document.createElement("span");
    statusEl.className = `dock-status ${status}`;
    statusEl.textContent = label;

    const name = document.createElement("div");
    name.className = "dock-name";
    name.textContent = agent.name;

    item.appendChild(bubble);
    item.appendChild(avatar);
    item.appendChild(statusEl);
    item.appendChild(name);

    item.addEventListener("click", () => {
      const card = document.querySelector(`.agent-card[data-id='${agent.id}']`);
      if (card) card.click();
    });

    dock.appendChild(item);
  });
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

function renderDailyReports(items) {
  const wrap = document.getElementById("dailyReports");
  if (!wrap) return;
  wrap.innerHTML = "";

  (items || []).forEach((r, idx) => {
    const item = document.createElement("div");
    item.className = "report-item";

    const head = document.createElement("div");
    head.className = "report-head";
    head.innerHTML = `<div><div class="report-title">${r.title}</div><div class="report-meta">${r.time} · ${r.agent}</div></div>`;

    const fullText = r.raw || r.content || "";
    const body = document.createElement("div");
    body.className = "report-body";
    body.textContent = fullText;

    const toggle = document.createElement("button");
    toggle.className = "report-toggle";
    toggle.textContent = "접기";
    toggle.addEventListener("click", () => {
      const collapsed = body.classList.contains("clamped");
      body.classList.toggle("clamped", !collapsed);
      toggle.textContent = collapsed ? "접기" : "원문 펼치기";
    });

    item.appendChild(head);
    item.appendChild(body);

    // 항상 토글 버튼 표시 (원문 확인용)
    item.appendChild(toggle);

    wrap.appendChild(item);
  });
}

function renderAll() {
  renderDate();
  renderAgents();
  renderDock();
  renderFilters();
  renderList("briefingList", getFilteredBriefings(""));
  renderList("noticeList", state.notices || []);
  renderNoticeBadge();
  renderQuality(state.quality || []);
  renderMatrix("sourceBoard", state.sources || []);
  renderCostBoard(state.costMonitoring || {});
  renderDailyReports(state.dailyReports || []);
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
