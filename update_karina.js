const fs = require('fs');
const path = '/Users/haluna/.openclaw/workspace/agent-dashboard/data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newRaw = `🎨 [카리나의 오전 9시 아트 브리핑]
Date: 2026년 4월 8일 수요일

안녕하세요, 슬기님! 언제나 반가운 비서 카리나예요. 🌙🎨
오늘 오전 9시, 아트넷(Artnet)의 따끈따끈한 최신 아트 마켓 업데이트를 전해드립니다!

최근 발표된 아트넷의 'Intelligence Report: The Year Ahead 2026'에 따르면, 2025년 글로벌 경매 판매액이 117억 달러를 기록하며 전년 대비 13.3% 증가했습니다. 2021년 이후 첫 상승세로 시장에 활기가 돌고 있어요. 하지만 이 회복세에는 눈에 띄는 '불균형' 트렌드가 숨어있습니다.

1️⃣ 신진 작가에서 '검증된 대가'로의 이동
젊은 신진 작가를 뜻하는 '울트라 컨템포러리' 시장은 4년 연속 냉각기를 맞으며 매출이 26.5% 크게 감소했어요. 대신 컬렉터들은 불안정한 시기에 안전 자산을 선호하며 검증된 거장들에게 집중하고 있습니다. 그 결과 '인상주의 및 모던 아트'가 가장 수익성 높은 카테고리로 떠올랐고, 구스타프 클림트의 '엘리자베스 레더러의 초상'이 2억 3,640만 달러에 낙찰되며 최상위 시장을 견인했습니다.

2️⃣ '프라이빗 경매'의 뜨거운 부상
최고급 명작을 조용하고 비밀스럽게 거래하고자 하는 슈퍼리치들의 수요가 커지면서, 비공개 오프시즌 '프라이빗 경매' 시장이 눈에 띄게 활성화되고 있어요.

3️⃣ 지역별 엇갈린 명암
미국은 54억 달러 규모로 전 세계 1위 미술 시장의 자리를 굳건히 지켰고, 영국(11.3%↑)과 프랑스(23%↑)도 강한 회복세를 보였습니다. 반면, 중국 시장은 11% 하락하며 상반된 행보를 보이고 있네요.

💡 카리나의 인사이트
미술 시장 전반이 회복되고 있지만, 철저하게 '안전 자산'과 '검증된 블루칩'으로 자본이 쏠리고 있는 양상입니다. 슬기님께서도 미술 투자 포트폴리오를 점검하실 때, 당분간은 실험적인 작품보다는 미술사적 가치가 확고한 클래식 명작의 방어력을 주목해보시는 게 좋을 것 같아요!

오늘 하루도 슬기님의 포트폴리오처럼 든든하고 성공적인 하루 보내시길 응원할게요! 📈✨`;

if(!data.dailyReports) data.dailyReports = {};
if(!data.dailyReports['카리나']) data.dailyReports['카리나'] = {};
data.dailyReports['카리나'].raw = newRaw;

fs.writeFileSync(path, JSON.stringify(data, null, 2));

const jsonlPath = '/Users/haluna/.openclaw/workspace/agent-dashboard/briefings-raw.jsonl';
const jsonlLine = JSON.stringify({
  ts: new Date('2026-04-08T00:00:00.000Z').toISOString(),
  agent: '카리나',
  title: '아트 브리핑',
  raw: newRaw
}) + '\n';
fs.appendFileSync(jsonlPath, jsonlLine);

console.log(newRaw);
