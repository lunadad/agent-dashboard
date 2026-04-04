const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.json');
let data = {};
if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

if (!data.costMonitoring) {
  // Initialize with some baseline if missing
  data.costMonitoring = {
    currency: "USD",
    updatedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
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
        calls: 19,
        models: [
          { name: "google/gemini-3.1-flash-lite", tokens: 43000 }
        ]
      }
    ]
  };
}

// Simulate usage increase
data.costMonitoring.updatedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
data.costMonitoring.byAgent.forEach(agent => {
  const newCalls = Math.floor(Math.random() * 5);
  const newTokens = newCalls * 1500;
  const newUsd = newTokens * 0.000005;

  agent.calls += newCalls;
  agent.dailyTokens += newTokens;
  agent.monthlyTokens += newTokens;
  agent.dailyUsd += newUsd;
  agent.monthlyUsd += newUsd;

  if (agent.models && agent.models.length > 0) {
    agent.models[0].tokens += newTokens;
  }
});

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log("Cost monitoring data updated.");
