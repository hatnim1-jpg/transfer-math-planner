// 편입수학 학습 플래너 — 일정 계산 엔진 (브라우저/Node 공용, 외부 의존성 없음)
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PlannerEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TZ = 'Asia/Seoul';
  const WD = ['일', '월', '화', '수', '목', '금', '토'];

  /* ---------- 날짜 유틸: 'YYYY-MM-DD' 문자열 + UTC 일수 연산 (시간대 오차 없음) ---------- */
  const pad = n => String(n).padStart(2, '0');
  function ymdToNum(s) { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
  function numToYmd(n) { const d = new Date(n * 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function addDays(s, k) { return numToYmd(ymdToNum(s) + k); }
  function diffDays(a, b) { return ymdToNum(b) - ymdToNum(a); }
  function dow(s) { return new Date(ymdToNum(s) * 86400000).getUTCDay(); }
  function weekdayKo(s) { return WD[dow(s)]; }
  // 서울 기준 오늘 날짜 (기기 시간대와 무관)
  function todaySeoul(now) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now || new Date());
  }

  /* ---------- 기본 설정 (모두 사용자가 변경 가능) ---------- */
  const DEFAULTS = {
    startDate: '2026-11-25',
    conceptDeadline: '2026-12-22',
    examDates: ['2027-01-09', '2027-01-10'], // 사용자 지정(2개). 가장 이른 시험 전날까지 일정을 만든다
    restWeekdays: [3],               // 매주 휴식 요일(0=일 … 3=수)
    restWeekdayExempt: ['2026-11-25'], // 시작일은 휴식에서 제외(사용자가 바꿀 수 있음)
    speed: 1.4,
    pausePct: 40,                    // 일시정지·필기: 1.4배속 시청 시간의 40%
    exampleConcept: 20,              // 대표 예제 풀이(분)
    exampleMixed: 10,                // 문제풀이가 이미 섞인 강의
    breakEveryMin: 60, breakMin: 10, // 작업 60분당 휴식 10분
    minHours: 4, maxHours: 7.5,      // 하루 공부 가능 시간 범위(점진적 증가). 수요일 휴식 때문에 6시간으로는 완강 불가
    readaptDays: 3, rampStepHours: 0.25,
    startupMin: 5,                   // 교재 펼치기
    wrapUpMin: 10,                   // 마무리 루틴(체크·기록·내일 확인)
    legacyReviewMin: 15,             // 미분·적분 취약 단원 복습
    reviewCapMin: 50,                // 하루 복습 총량 상한(기존 단원 복습 포함)
    reviewOffsets: [1, 3, 7], reviewMinutes: [8, 5, 5],
    maxLecturesPerDay: 3,
    problemsConcept: 3, problemsMixed: 2,
    subjectOrder: ['linear', 'multi', 'eng'],
    restDays: ['2026-11-24']
  };

  /* ---------- 강의 시간 계산 ---------- */
  // 원본 분 ÷ 배속, 올림. 부동소수점 오차(예: 70/1.4)를 피하려고 정수 연산만 사용.
  function videoMinutes(orig, speed) {
    const s = Math.round(speed * 10);
    return Math.floor((orig * 10 + s - 1) / s);
  }
  function lectureCost(l, st) {
    const s = Object.assign({}, DEFAULTS, st || {});
    const video = videoMinutes(l.origMin, l.speed || s.speed); // 강의별 배속이 있으면 우선
    const note = Math.floor((video * s.pausePct + 99) / 100);
    const example = l.kind === 'mixed' ? s.exampleMixed : s.exampleConcept;
    const work = video + note + example;
    const brk = Math.floor(work / s.breakEveryMin) * s.breakMin;
    return { orig: l.origMin, video, note, example, brk, work, total: work + brk };
  }

  /* ---------- 하루 공부 가능 시간 ---------- */
  function dayHours(date, s, overrides) {
    const o = overrides && overrides[date];
    if (o && typeof o.hours === 'number') return o.hours;
    const idx = diffDays(s.startDate, date);
    if (idx < s.readaptDays) return s.minHours;
    return Math.min(s.maxHours, s.minHours + (idx - s.readaptDays + 1) * s.rampStepHours);
  }

  /* ---------- 일정 생성 ---------- */
  function isDoneStatus(l, completions) { return l.status === 'completed' || l.status === 'review' || !!completions[l.id]; }

  function buildPlan(input) {
    const s = Object.assign({}, DEFAULTS, input.settings || {});
    const lectures = input.lectures;
    const overrides = input.overrides || {};
    const completions = input.completions || {};
    const history = input.history || {};
    const reviewDone = new Set(input.reviewDone || []);
    const fromDate = input.fromDate || s.startDate;
    const allowBeyond = !!input.allowBeyond;
    const restSet = new Set(s.restDays || []);
    const isRest = d => (overrides[d] && overrides[d].rest === false) ? false : restSet.has(d) || ((s.restWeekdays || []).indexOf(dow(d)) >= 0 && (s.restWeekdayExempt || []).indexOf(d) < 0) || !!(overrides[d] && overrides[d].rest === true);
    const rank = id => { const i = s.subjectOrder.indexOf(id); return i < 0 ? 99 : i; };

    const byId = new Map(lectures.map(l => [l.id, l]));
    const queue = lectures
      .filter(l => l.status !== 'excluded' && l.kind !== 'ot' && !isDoneStatus(l, completions))
      .sort((a, b) => rank(a.subject) - rank(b.subject) || (a.seq != null ? a.seq : a.no) - (b.seq != null ? b.seq : b.no));
    // 같은 과목 안의 선수 관계는 현재 순서(수정 반영)에서 다시 만들고, 다른 과목 선수만 데이터에서 가져온다.
    const effPrereq = new Map(); const lastBySubject = {};
    queue.forEach(l => {
      const cross = (l.prereq || []).filter(id => { const p = byId.get(id); return p && p.subject !== l.subject; });
      const prev = lastBySubject[l.subject];
      effPrereq.set(l.id, prev ? cross.concat(prev) : cross);
      lastBySubject[l.subject] = l.id;
    });
    const placedDate = new Map();               // 이번 계산에서 배정된 강의 -> 날짜
    const isSatisfied = id => { const p = byId.get(id); return !p || isDoneStatus(p, completions) || p.status === 'excluded' || placedDate.has(id); };

    const lastDate = addDays(s.examDates.slice().sort()[0], -1);
    const days = [];
    const pool = [];                            // 복습 항목 풀
    const addReviews = (lecId, date) => {
      s.reviewOffsets.forEach((off, i) => {
        const key = lecId + ':' + off;
        if (reviewDone.has(key)) return;
        pool.push({ key, lecId, offset: off, due: addDays(date, off), min: s.reviewMinutes[i] });
      });
    };
    Object.keys(completions).forEach(id => addReviews(id, completions[id]));

    let qi = 0, studyDays = 0;
    for (let d = s.startDate; d <= lastDate; d = addDays(d, 1)) {
      const entry = {
        date: d, dow: dow(d), weekday: weekdayKo(d), idx: diffDays(s.startDate, d),
        phase: d <= s.conceptDeadline ? 'concept' : 'exam-prep',
        past: d < fromDate, rest: false,
        done: [], missed: [], lectures: [], reviews: [], legacyMin: 0, fixedMin: 0,
        capMin: 0, usedMin: 0, freeMin: 0, problems: 0
      };
      const doneToday = lectures.filter(l => completions[l.id] === d);
      entry.done = doneToday.map(l => l.id);

      if (d < fromDate) {
        entry.missed = (history[d] || []).filter(id => byId.get(id) && !isDoneStatus(byId.get(id), completions));
        days.push(entry); continue;
      }
      if (isRest(d)) { entry.rest = true; days.push(entry); continue; }

      const mode = (overrides[d] && overrides[d].mode) || null;   // recover | basic | focus
      entry.mode = mode;
      let cap = Math.round(dayHours(d, s, overrides) * 60);
      if (input.softLanding && studyDays < input.softLanding.days) cap = Math.min(cap, Math.round(input.softLanding.hours * 60));
      studyDays++;
      entry.fixedMin = s.startupMin + s.wrapUpMin;
      const doneCosts = doneToday.map(l => Object.assign({ id: l.id, done: true }, lectureCost(l, s)));
      const doneCost = doneCosts.reduce((a, x) => a + x.total, 0);
      entry.lectures = doneCosts.slice();

      if (mode === 'recover') {
        // 회복 모드: 새 강의 없이 교재 5분 + 강의 20분 시청 + 개념 하나 기록. 복습·강의는 뒤로(기록은 지우지 않음)
        entry.capMin = Math.min(cap, 60); entry.legacyMin = 0; entry.recoverMin = 20;
        entry.usedMin = entry.fixedMin + entry.recoverMin + doneCost;
        entry.freeMin = entry.capMin - entry.usedMin;
        entry.problems = entry.lectures.reduce((a, x) => a + (byId.get(x.id).kind === 'mixed' ? s.problemsMixed : s.problemsConcept), 0);
        days.push(entry); continue;
      }
      entry.capMin = cap;
      entry.legacyMin = s.legacyReviewMin;

      // 복습: 기한이 지난 항목부터, 하루 상한 이내로 (남는 것은 다음 날로 이월)
      let revBudget = Math.max(0, s.reviewCapMin - entry.legacyMin);
      pool.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.offset - b.offset));
      for (let i = 0; i < pool.length;) {
        const it = pool[i];
        if (it.due <= d && it.min <= revBudget) { entry.reviews.push(it); revBudget -= it.min; pool.splice(i, 1); } else i++;
      }
      const reviewMin = entry.legacyMin + entry.reviews.reduce((a, r) => a + r.min, 0);
      let budget = cap - entry.fixedMin - reviewMin - doneCost;

      // 강의 배정: 순서·선수학습 유지, 하루 공부 가능 시간 초과 금지, 이월분 몰아넣기 금지
      const canPlace = d <= s.conceptDeadline || allowBeyond;
      const maxL = mode === 'basic' ? Math.min(2, s.maxLecturesPerDay) : s.maxLecturesPerDay;
      let count = doneToday.length;
      while (canPlace && qi < queue.length && count < maxL) {
        const l = queue[qi];
        if (!effPrereq.get(l.id).every(isSatisfied)) break;
        const c = lectureCost(l, s);
        if (c.total > budget) break;
        entry.lectures.push(Object.assign({ id: l.id, beyond: d > s.conceptDeadline }, c));
        placedDate.set(l.id, d); addReviews(l.id, d);
        budget -= c.total; count++; qi++;
      }
      const placedCost = entry.lectures.filter(x => !x.done).reduce((a, x) => a + x.total, 0);
      entry.usedMin = entry.fixedMin + reviewMin + doneCost + placedCost;
      entry.freeMin = cap - entry.usedMin;
      entry.problems = entry.lectures.reduce((a, x) => a + (byId.get(x.id).kind === 'mixed' ? s.problemsMixed : s.problemsConcept), 0);
      days.push(entry);
    }

    const unplacedList = queue.filter(l => !placedDate.has(l.id));
    const withinDeadline = queue.filter(l => placedDate.has(l.id) && placedDate.get(l.id) <= s.conceptDeadline);
    const unplaced = queue.filter(l => !placedDate.has(l.id) || placedDate.get(l.id) > s.conceptDeadline);
    const plan = {
      settings: s, days, fromDate,
      placed: Object.fromEntries(placedDate),
      pendingCount: queue.length,
      feasible: unplaced.length === 0,
      unplaced: unplaced.map(l => l.id),
      unplacedWithinHorizon: unplacedList.map(l => l.id),
      pendingTotalMin: queue.reduce((a, l) => a + lectureCost(l, s).total, 0),
      finishDate: withinDeadline.length ? withinDeadline.map(l => placedDate.get(l.id)).sort().pop() : null
    };
    if (!plan.feasible && !input._noAnalysis) plan.alternatives = analyze(input, plan, queue);
    return plan;
  }

  // 불가능할 때 대안 계산: 완강일 연장 / 필요 공부 시간 / 우선순위 낮은 강의 후보
  function analyze(input, plan, queue) {
    const s = plan.settings;
    const clone = extra => Object.assign({}, input, { _noAnalysis: true }, extra);
    const shortfallMin = plan.unplaced.reduce((a, id) => a + lectureCost(queue.find(l => l.id === id), s).total, 0);

    const ext = buildPlan(clone({ allowBeyond: true }));
    const extLast = ext.days.filter(d => d.lectures.length).map(d => d.date).sort().pop() || null;
    const extension = ext.unplacedWithinHorizon.length === 0 && extLast
      ? { date: extLast, extraDays: diffDays(s.conceptDeadline, extLast) } : null;

    // 하루 일정한 공부 시간 h로 가능한 최소값 (분 단위 이진 탐색)
    const feasibleAt = m => buildPlan(clone({ settings: Object.assign({}, input.settings, { minHours: m / 60, maxHours: m / 60 }), overrides: {} })).feasible;
    let lo = 60, hi = 16 * 60, requiredHours = null;
    if (feasibleAt(hi)) {
      while (lo < hi) { const mid = (lo + hi) >> 1; if (feasibleAt(mid)) hi = mid; else lo = mid + 1; }
      requiredHours = Math.round(lo / 60 * 100) / 100;
    }
    // 우선순위 후보: 개념+문제풀이 혼합 강의 중 뒤쪽 순서부터 (자동 제외하지 않음, 사용자 검토용)
    const cands = queue.filter(l => l.kind === 'mixed').reverse().map(l => ({ id: l.id, saveMin: lectureCost(l, s).total }));
    return { shortfallMin, extension, requiredUniformHours: requiredHours, lowPriorityCandidates: cands };
  }

  /* ---------- 변경 전후 비교 ---------- */
  function diffPlans(a, b) {
    const pa = a.placed || {}, pb = b.placed || {};
    const moved = [], added = [], removed = [];
    let unchanged = 0;
    Object.keys(pa).forEach(id => {
      if (!(id in pb)) removed.push({ id, from: pa[id] });
      else if (pa[id] !== pb[id]) moved.push({ id, from: pa[id], to: pb[id] });
      else unchanged++;
    });
    Object.keys(pb).forEach(id => { if (!(id in pa)) added.push({ id, to: pb[id] }); });
    return { moved, added, removed, unchanged };
  }

  return { TZ, DEFAULTS, ymdToNum, numToYmd, addDays, diffDays, dow, weekdayKo, todaySeoul,
    videoMinutes, lectureCost, dayHours, buildPlan, diffPlans };
});
