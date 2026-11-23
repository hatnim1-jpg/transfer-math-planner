(function () {
  'use strict';
  var E = PlannerEngine, D = LECTURE_DATA;
  var SUBJ = {}; D.subjects.forEach(function (s) { SUBJ[s.id] = s; });
  var KEY = 'planner.v1';
  var qs = new URLSearchParams(location.search);

  /* ---------- 상수 ---------- */
  var ROUTINE0 = [
    { g: '공부 시작 루틴', items: [['water', '물 마시기 및 식사'], ['desk', '책상 정리'], ['book', '교재 펼치기 5분'], ['prev', '전날 개념 복습 10~15분'], ['first', '오늘의 첫 강의 시작']] },
    { g: '학습 루틴', items: [['lec', '강의 수강'], ['ex', '대표 예제 1~3문제'], ['hard', '어려웠던 개념 표시'], ['weak', '미분·적분·선형대수 취약 단원 복습'], ['move', '휴식 및 가벼운 움직임']] },
    { g: '마무리 루틴', items: [['chk', '오늘 들은 강의 체크'], ['und', '이해도 기록'], ['wrong', '틀린 문제 기록'], ['tmr', '내일 공부 확인'], ['good', '오늘 잘한 행동 하나 적기']] }
  ].map(function (g) { return { g: g.g, items: g.items.map(function (i) { return { id: i[0], label: i[1] }; }) }; });
  var MODES = {
    recover: { n: '회복', d: ['교재 펼치기 5분', '강의 20분 시청', '핵심 개념 하나 기록'] },
    basic: { n: '기본', d: ['계획된 강의 1~2개', '대표 예제 풀이', '복습 20~30분'] },
    focus: { n: '집중', d: ['강의 2~3개', '복습 및 문제풀이', '기출문제 추가 학습'] }
  };
  var MSG = ['오늘도 공부를 시작했어요.', '모르는 부분을 발견한 것도 학습의 일부예요.', '어제보다 한 걸음 나아갔어요.', '계획이 달라져도 다시 이어갈 수 있어요.'];
  var STATUS = { pending: '수강 전', in_progress: '수강 중', completed: '수강 완료', review: '복습 필요', excluded: '제외' };
  var LEVELS = ['이해함', '조금 헷갈림', '다시 공부 필요'];
  var LEVEL_RANK = { '다시 공부 필요': 0, '조금 헷갈림': 1, '이해함': 2 };
  var OFFSETS = [1, 3, 7], REVMIN = [8, 5, 5];
  var offsetLabel = { 1: '다음 날 복습', 3: '3일 뒤 복습', 7: '7일 뒤 복습' };

  /* ---------- 저장소 ---------- */
  function defaultState() {
    return { v: 2, settings: { exams: [{ date: '2027-01-09', name: '한양대학교' }, { date: '2027-01-10', name: '중앙대학교' }] },
      plan: null, completions: {}, reviewDone: [], reviewLog: {}, reviewNotes: [], lectureEdits: {}, customLectures: [],
      routine: JSON.parse(JSON.stringify(ROUTINE0)), daily: {},
      planCfg: { maxHours: 7.5, minHours: 4, restWeekdays: [3], deadline: '2026-12-22' }, overrides: {},
      sessions: [], timer: null };
  }
  function load() { try { var r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 저장 실패해도 계속 사용 */ } }
  var S = Object.assign(defaultState(), load() || {});
  if (!S.settings.exams) { // v1 → v2 이전
    var old = (S.settings.examDates || []).slice().sort();
    S.settings.exams = defaultState().settings.exams.map(function (x, i) { return { date: old[i] || x.date, name: x.name }; });
  }
  S.v = 2;

  function examDates() { return S.settings.exams.map(function (x) { return x.date; }).sort(); }
  function planSettings(cfg) {
    return { examDates: examDates(), maxHours: cfg.maxHours, minHours: cfg.minHours, restWeekdays: cfg.restWeekdays, conceptDeadline: cfg.deadline };
  }
  function mergedLectures() {
    return allBase().map(function (b) { var l = getLec(b.id); var ed = S.lectureEdits[b.id]; l.status = (ed && ed.status) || b.status; return JSON.parse(JSON.stringify(l)); });
  }
  function sigNow() {
    return allBase().map(function (b) { var ed = S.lectureEdits[b.id] || {}; return [b.id, ed.status || b.status, ed.origMin || b.origMin, ed.speed || '', ed.seq != null ? ed.seq : b.no].join(':'); }).join('|');
  }
  function moodsFrom(from) { var m = {}; Object.keys(S.daily).forEach(function (d) { if (d >= from && S.daily[d].mood) m[d] = S.daily[d].mood; }); return m; }
  function snapshot(res, keepDays, log) {
    return { generatedAt: new Date().toISOString(), feasible: res.feasible, unplaced: res.unplaced, finishDate: res.finishDate,
      alternatives: res.alternatives || null, settings: res.settings, days: keepDays, sig: sigNow(), moods: moodsFrom(res.fromDate), log: log || [] };
  }
  function genPlan() {
    var res = E.buildPlan({ lectures: mergedLectures(), settings: planSettings(S.planCfg), overrides: Object.assign({}, S.overrides) });
    S.plan = snapshot(res, res.days, []);
  }
  if (!S.plan) genPlan();
  if (!S.plan.sig) { // 이전 버전 저장분: 원본 강의 데이터 기준으로 일정이 만들어졌다고 본다
    S.plan.sig = allBase().map(function (b) { return [b.id, b.status, b.origMin, '', b.no].join(':'); }).join('|'); S.plan.moods = S.plan.moods || {};
  }
  save();

  /* ---------- 강의 조회 (수정·추가 반영) ---------- */
  function allBase() { return D.lectures.concat(S.customLectures); }
  function getLec(id) { var b = allBase().find(function (l) { return l.id === id; }); return b ? Object.assign({}, b, S.lectureEdits[id] || {}) : null; }
  function effStatus(l) {
    var ed = S.lectureEdits[l.id]; if (ed && ed.status) return ed.status;
    return S.completions[l.id] ? 'completed' : l.status;
  }
  function isDone(id) { var l = getLec(id); return !!S.completions[id] || (l && (effStatus(l) === 'completed' || effStatus(l) === 'review')); }
  function lecTitle(id) { var l = getLec(id); return SUBJ[l.subject].name + ' ' + l.no + '강'; }
  function lecName(id) { return getLec(id).name; }
  function lecVideo(l) { return E.videoMinutes(l.origMin, l.speed || 1.4); }

  /* ---------- 유틸 ---------- */
  function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function realToday() { return qs.get('today') || E.todaySeoul(); }
  function md(d) { var p = d.split('-'); return Number(p[1]) + '월 ' + Number(p[2]) + '일'; }
  function mdw(d) { return md(d) + ' (' + E.weekdayKo(d) + ')'; }
  function fmt(m) { m = Math.round(m); var h = Math.floor(m / 60), r = m % 60; return h ? (h + '시간' + (r ? ' ' + r + '분' : '')) : (r + '분'); }
  function day(d) { return S.plan.days.find(function (x) { return x.date === d; }); }
  function dailyOf(d) { if (!S.daily[d]) S.daily[d] = { mood: null, note: '', routine: {} }; return S.daily[d]; }
  function shortName(n) { return n.replace('대학교', ''); }
  function examOn(d) { return S.settings.exams.find(function (x) { return x.date === d; }); }
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  var START = S.plan.settings.startDate, DEADLINE = S.plan.settings.conceptDeadline;
  var TODAY = realToday();
  var ui = { tab: location.hash.slice(1) || 'today', cal: 'month', calDate: null, routineEdit: false, tcfg: { lecId: '', focus: 25, custom: 30 }, timerOpen: false, tmsg: '' };
  function lastPlanDate() { return E.addDays(examDates()[0], -1); }
  function activeDay() { return TODAY < START ? START : TODAY; }
  ui.calDate = TODAY < START || TODAY > lastPlanDate() ? START : TODAY;

  /* ---------- 하루 통계 ---------- */
  function stats(d) {
    var o = { orig: 0, video: 0, note: 0, example: 0, brk: 0, review: 0, fixed: 0, total: 0, cap: 0, doneMin: 0, plannedMin: 0, problems: 0 };
    if (!d) return o;
    d.lectures.forEach(function (x) {
      if (x.moved && !isDone(x.id)) return;
      o.orig += x.orig; o.video += x.video; o.note += x.note; o.example += x.example; o.brk += x.brk;
      o.plannedMin += x.total; if (isDone(x.id)) o.doneMin += x.total;
    });
    o.review = d.legacyMin + d.reviews.reduce(function (a, r) { return a + r.min; }, 0);
    o.fixed = d.fixedMin; o.total = d.usedMin; o.cap = d.capMin; o.problems = d.problems;
    return o;
  }

  /* ---------- 복습: 실제 완료일 기준으로 다음 날/3일/7일 후 ---------- */
  function dueNow(t) {
    var out = [];
    Object.keys(S.completions).forEach(function (id) {
      if (!getLec(id)) return;
      OFFSETS.forEach(function (off, i) {
        var key = id + ':' + off, due = E.addDays(S.completions[id], off);
        if (due <= t && S.reviewDone.indexOf(key) < 0) out.push({ key: key, lecId: id, offset: off, due: due, min: REVMIN[i] });
      });
    });
    out.sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : a.offset - b.offset; });
    return out;
  }
  function rate(key, level) {
    var parts = key.split(':'), id = parts[0];
    if (S.reviewDone.indexOf(key) < 0) S.reviewDone.push(key);
    S.reviewLog[key] = { date: TODAY, level: level };
    if (level !== '이해함' && !S.reviewNotes.some(function (n) { return n.srcKey === key; })) {
      S.reviewNotes.push({ id: uid('n'), srcKey: key, concept: lecName(id), lecId: id, problem: '', kind: '일반', reason: '',
        retryDate: E.addDays(TODAY, level === '다시 공부 필요' ? 1 : 3), level: level, retrySuccess: null, tries: [], created: TODAY });
    }
    save();
  }
  function reviewRow(r, withRate) {
    var logged = S.reviewLog[r.key];
    return '<li><div><span class="tag s">' + offsetLabel[r.offset] + '</span> ' + e(lecTitle(r.lecId)) + ' · ' + e(lecName(r.lecId)) + ' <span class="meta">(' + r.min + '분' + (r.due < TODAY ? ' · ' + md(r.due) + ' 예정분' : '') + ')</span></div>' +
      (withRate ? '<div class="rate">' + LEVELS.map(function (lv) { return '<button data-action="rate" data-key="' + e(r.key) + '" data-lv="' + e(lv) + '">' + lv + '</button>'; }).join('') + '</div>' : '') +
      (logged ? '<div class="meta">기록: ' + e(logged.level) + '</div>' : '') + '</li>';
  }
  function planReviewItems(d) {
    if (!d || !d.reviews.length) return '<p class="muted">이 날짜에 계획된 강의 복습 항목은 없어요.</p>';
    return '<ul class="plain">' + d.reviews.map(function (r) {
      return '<li><span class="tag s">' + offsetLabel[r.offset] + '</span> ' + e(lecTitle(r.lecId)) + ' · ' + e(lecName(r.lecId)) + ' <span class="meta">(' + r.min + '분)</span></li>';
    }).join('') + '</ul>';
  }

  /* ---------- 화면: 오늘 ---------- */
  function lectureItem(x) {
    var l = getLec(x.id), done = isDone(x.id);
    if (x.moved && !done) return '<div class="lec" style="opacity:.6"><span style="flex:0 0 28px"></span><span class="grow"><span class="t" style="font-weight:500">' + e(lecTitle(x.id)) + ' · ' + e(l.name) + '</span><br><span class="meta">다른 날짜로 다시 배치됐어요 (기록은 그대로 남아 있어요)</span></span></div>';
    return '<div class="lec' + (done ? ' done' : '') + '"><label><input type="checkbox" data-action="toggle-lec" data-id="' + e(x.id) + '"' + (done ? ' checked' : '') + '>' +
      '<span class="grow"><span class="t">' + e(lecTitle(x.id)) + ' · ' + e(l.name) + '</span><br>' +
      '<span class="meta">원본 ' + x.orig + '분 → 1.4배속 ' + x.video + '분 · 예상 학습 ' + fmt(x.total) + '</span><br>' +
      (l.kind === 'mixed' ? '<span class="tag b">개념+문제풀이</span>' : '') + '</span></label>' + (done ? '' : '<button class="mini" data-action="timer-open" data-id="' + e(x.id) + '" aria-label="타이머로 공부 시작">▶ 타이머</button>') + '</div>';
  }
  function infeasibleBanner() {
    var a = S.plan.alternatives || {};
    var h = '<div class="banner"><b>현재 설정으로는 ' + md(DEADLINE) + '까지 모든 강의를 배치할 수 없어요.</b><br>남은 ' + S.plan.unplaced.length + '강이 들어가지 못했어요. 대안: ';
    var opts = [];
    if (a.extension) opts.push('완강 목표일을 ' + md(a.extension.date) + '로 연장');
    if (a.requiredUniformHours) opts.push('하루 약 ' + a.requiredUniformHours + '시간 확보');
    opts.push('우선순위가 낮은 강의 재검토');
    return h + opts.join(' / ') + '</div>';
  }
  function recoverCard(np) {
    return '<section class="card" style="background:var(--lav);border-color:#CFC6E6"><h2>회복 모드 · 오늘은 가볍게</h2><ul class="plain"><li>교재 펼치기 5분</li><li>강의 20분 시청' + (np ? ' — ' + e(lecTitle(np.id)) + ' · ' + e(lecName(np.id)) : '') + '</li><li>핵심 개념 하나 기록</li></ul>' +
      '<p class="meta">오늘은 새 강의를 끝내지 않아도 괜찮아요. 못 들은 강의는 기록을 지우지 않고 뒤쪽 날짜로 이어서 배치돼요.</p></section>';
  }
  function routineCard(dd) {
    var done = 0, total = 0;
    S.routine.forEach(function (g) { g.items.forEach(function (it) { total++; if (dd.routine[it.id]) done++; }); });
    var h = '<section class="card"><div class="row"><h2 class="grow" style="margin:0">오늘의 루틴 <span class="meta">' + done + '/' + total + '</span></h2><button class="mini" data-action="routine-edit">' + (ui.routineEdit ? '완료' : '편집') + '</button></div>';
    S.routine.forEach(function (g, gi) {
      h += '<h3>' + e(g.g) + '</h3>' + g.items.map(function (it) {
        var on = dd.routine[it.id];
        return '<div class="lec' + (on ? ' done' : '') + '" style="min-height:48px;padding:8px 0"><label><input type="checkbox" data-action="routine" data-k="' + e(it.id) + '"' + (on ? ' checked' : '') + '><span class="grow t" style="font-weight:500">' + e(it.label) + '</span></label>' +
          (ui.routineEdit ? '<button class="mini del" data-action="routine-del" data-g="' + gi + '" data-id="' + e(it.id) + '" aria-label="삭제">삭제</button>' : '') + '</div>';
      }).join('');
      if (ui.routineEdit) h += '<div class="row" style="margin-top:6px"><input type="text" id="radd' + gi + '" placeholder="항목 추가" maxlength="40"><button class="mini" data-action="routine-add" data-g="' + gi + '">추가</button></div>';
    });
    return h + '<p class="meta">루틴은 날짜마다 새로 시작하고, 지난 날짜의 체크 기록은 그대로 남아요.</p></section>';
  }
  function viewToday() {
    var t = TODAY, preview = t < START, dk = activeDay(), d = day(dk), h = '', dd = dailyOf(dk);
    var upcoming = S.settings.exams.filter(function (x) { return x.date >= t; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var untilConcept = E.diffDays(t, DEADLINE);
    h += '<section class="card hero"><div class="date">' + mdw(t) + '</div><div class="muted">' + MSG[E.ymdToNum(t) % MSG.length] + '</div><div class="chips">' +
      upcoming.map(function (x) { return '<span class="chip pink">' + e(shortName(x.name)) + ' <b>D-' + E.diffDays(t, x.date) + '</b> (' + md(x.date) + ')</span>'; }).join('') +
      (untilConcept >= 0 ? '<span class="chip">개념 완강 목표(' + md(DEADLINE) + ')까지 <b>' + untilConcept + '일</b></span>' : '<span class="chip">개념 강의 기간 종료 · 기출/취약 단원 복습 중심</span>') + '</div></section>';
    if (!S.plan.feasible) h += infeasibleBanner();
    h += staleBanner();
    if (!preview && t <= lastPlanDate() && d && !d.rest) h += '<section class="card" style="background:var(--sage-l);border:0"><div class="row"><div class="grow"><b>시작이 어려운 날이에요?</b><div class="meta">딱 5분만 해 봐요. 끝나고 계속할지 골라도 돼요.</div></div><button class="mini" style="background:var(--sage);color:#fff" data-action="tm-five">5분만 시작하기</button></div></section>';
    if (preview) h += '<div class="banner soft">학습 시작(' + mdw(START) + ')까지 ' + E.diffDays(t, START) + '일 남았어요. 아래는 첫날 계획 미리보기예요. 11월 24일은 완전 휴식이에요.</div>';
    else if (t > lastPlanDate()) return h + '<section class="card empty">계획 기간이 끝났어요. 마지막까지 차분하게 정리해요.</section>';
    if (!d) return h + '<section class="card empty">이 날짜의 계획이 없어요.</section>';
    if (t > DEADLINE && !preview) h += '<div class="banner soft">개념 강의 기간이 끝났어요. 지금은 기출문제와 취약 단원 복습이 중심이에요.</div>';

    if (d.rest) {
      h += '<section class="card"><h2>오늘은 쉬는 날이에요</h2><p class="muted">쉬는 날에는 강의와 복습을 배정하지 않아요. 충분히 쉬고 다음 계획으로 이어가면 돼요.</p></section>';
    } else {
      var st = stats(d), pct = st.plannedMin ? Math.round(st.doneMin / st.plannedMin * 100) : 0;
      h += '<section class="card"><h2>오늘의 학습 계획</h2><div class="grid2"><div class="stat"><span class="meta">원본 강의 합계</span><b>' + fmt(st.orig) + '</b></div><div class="stat"><span class="meta">1.4배속 시청 합계</span><b>' + fmt(st.video) + '</b></div></div>' +
        '<p style="margin:12px 0 4px"><b>예상 실제 공부 시간 ' + fmt(st.total) + '</b> <span class="meta">/ 오늘 가능 ' + fmt(st.cap) + '</span></p>' +
        '<p class="meta" style="margin:0">영상 ' + st.video + '분 · 일시정지·필기 ' + st.note + '분 · 예제 ' + st.example + '분 · 복습 ' + st.review + '분 · 휴식 ' + st.brk + '분 · 시작/마무리 ' + st.fixed + '분</p>' +
        '<p class="meta"><b>실제 측정 ' + fmt(activeSec(dk) / 60) + '</b> · 예상 ' + fmt(st.total) + ' (타이머로 잰 시간)</p>' +
        '<p class="meta">영상 재생 시간과 실제 공부 시간은 따로 계산해요. 남는 ' + fmt(Math.max(0, d.freeMin)) + '은 문제풀이·여유 시간이에요.</p>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div><div class="meta">완료한 강의 기준 진행률 ' + pct + '%' + (st.problems ? ' · 대표 예제 ' + st.problems + '문제' : '') + '</div></section>';
      if (d.mode === 'recover') h += recoverCard(nextPending());
      else {
      h += '<section class="card"><h2>오늘의 강의</h2>' + (d.lectures.length ? d.lectures.map(lectureItem).join('') : '<p class="muted">오늘은 새 강의 없이 복습과 문제풀이 중심이에요.</p>') + '</section>';
      var due = preview ? [] : dueNow(t);
      h += '<section class="card"><h2>오늘 복습할 단원</h2>' + (due.length ? '<ul class="plain">' + due.map(function (r) { return reviewRow(r, true); }).join('') + '</ul>' :
        '<p class="muted">' + (preview ? '강의를 들으면 다음 날부터 복습이 열려요.' : '지금 복습할 강의 항목이 없어요.') + '</p>') +
        '<p class="meta">미분·적분 취약 단원 복습 ' + d.legacyMin + '분도 하루 계획에 잡혀 있어요. 복습 탭에서 틀린 문제와 재도전을 관리해요.</p></section>';
      }
    }
    h += '<section class="card"><h2>오늘 컨디션</h2><div class="mood">' + Object.keys(MODES).map(function (k) {
      return '<button data-action="mood" data-k="' + k + '" class="' + (dd.mood === k ? 'on' : '') + '">' + MODES[k].n + ' 모드</button>';
    }).join('') + '</div>' + (dd.mood ? '<ul class="plain" style="margin-top:10px">' + MODES[dd.mood].d.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ul>' +
      '<p class="meta">모드를 고르면 ‘일정 다시 맞추기’ 안내가 떠요. 미리보기를 확인한 뒤에만 일정이 바뀌고, 기록은 지워지지 않아요.</p>' : '<p class="meta">어떤 날이어도 괜찮아요. 오늘의 상태를 골라 보세요.</p>') + '</section>';
    h += routineCard(dd);
    h += '<section class="card"><h2>오늘의 한 줄 기록</h2><textarea id="note" placeholder="오늘 어땠는지 한 줄만 적어도 충분해요." data-action="note">' + e(dd.note) + '</textarea></section>';
    return h + '<button class="btn" data-action="start-study">공부 시작</button>';
  }

  /* ---------- 화면: 캘린더 ---------- */
  function dayBadge(d) {
    var x = day(d); if (!x) return { cls: 'out', mk: '' };
    if (x.rest) return { cls: 'rest', mk: '휴식' };
    var act = x.lectures.filter(function (l) { return !l.moved || isDone(l.id); }), n = act.length, all = n && act.every(function (l) { return isDone(l.id); });
    return { cls: all ? 'alldone' : '', mk: n ? n + '강' + (all ? ' ✓' : '') : (x.phase === 'exam-prep' ? '복습' : '') };
  }
  function cell(d, ym) {
    var b = dayBadge(d), ex = examOn(d);
    var cls = 'cell ' + b.cls + (d === TODAY ? ' today' : '') + (d === ui.calDate ? ' sel' : '') + (d.slice(0, 7) !== ym ? ' out' : '');
    var mk = ex ? '<span class="mk e">' + e(shortName(ex.name)) + '</span>' : (d === DEADLINE ? '<span class="mk e">완강목표</span>' : '<span class="mk">' + b.mk + '</span>');
    return '<button class="' + cls + '" data-action="pick-date" data-date="' + d + '"><span class="n">' + Number(d.slice(8)) + '</span>' + mk + '</button>';
  }
  function dayDetail(d) {
    var x = day(d), h = '';
    var ex = examOn(d), xm = day(d), modeTag = xm && xm.mode ? '<span class="tag">' + MODES[xm.mode].n + ' 모드</span>' : '', canEdit = d >= fromDay() && xm,
      restBtn = canEdit ? '<button class="mini" style="margin-top:10px" data-action="toggle-rest" data-date="' + d + '">' + (xm.rest ? '휴식 해제하고 일정 다시 보기' : '이 날 쉬는 날로 바꾸기') + '</button>' : '', tags = modeTag + (ex ? '<span class="tag p">' + e(ex.name) + ' 시험일</span>' : '') + (d === DEADLINE ? '<span class="tag p">개념 완강 목표일</span>' : '');
    if (!x) return '<section class="card empty">이 날짜는 계획 기간 밖이에요.' + (ex ? '<br>' + tags : '') + '</section>';
    if (x.rest) return '<section class="card"><h2>' + mdw(d) + ' ' + tags + '</h2><p class="muted">쉬는 날이에요. 강의와 복습을 배정하지 않았어요.</p>' + restBtn + '</section>';
    var st = stats(x);
    h += '<section class="card"><h2>' + mdw(d) + ' ' + tags + '</h2><p class="meta" style="margin:0">' + (x.phase === 'concept' ? '개념 강의 기간' : '기출·취약 단원 복습 기간') + ' · 예상 ' + fmt(st.total) + ' / 가능 ' + fmt(st.cap) + '</p>' +
      '<div class="grid2" style="margin-top:8px"><div class="stat"><span class="meta">원본 / 1.4배속</span><b>' + st.orig + '분 / ' + st.video + '분</b></div><div class="stat"><span class="meta">풀어야 할 대표 예제</span><b>' + st.problems + '문제</b></div></div>' + (activeSec(d) ? '<p class="meta">실제 측정 ' + fmt(activeSec(d) / 60) + '</p>' : '') + restBtn + '</section>';
    h += '<section class="card"><h2>강의</h2>' + (x.lectures.length ? x.lectures.map(lectureItem).join('') : '<p class="muted">새 강의 없이 복습과 문제풀이 중심이에요.</p>') + '</section>';
    return h + '<section class="card"><h2>복습할 단원 <span class="meta">(계획 기준)</span></h2>' + planReviewItems(x) + '</section>';
  }
  function viewCalendar() {
    var cd = ui.calDate, h = '<div class="seg">' + [['month', '월간'], ['week', '주간'], ['day', '일간']].map(function (m) {
      return '<button data-action="cal-mode" data-k="' + m[0] + '" class="' + (ui.cal === m[0] ? 'on' : '') + '">' + m[1] + '</button>';
    }).join('') + '</div>';
    if (!S.plan.feasible) h += infeasibleBanner();
    h += staleBanner();
    if (ui.cal === 'month') {
      var ym = cd.slice(0, 7), first = ym + '-01', gs = E.addDays(first, -E.dow(first));
      h += '<div class="cal-head"><button class="nav-btn" data-action="cal-prev" aria-label="이전 달">‹</button><span class="ttl">' + ym.slice(0, 4) + '년 ' + Number(ym.slice(5)) + '월</span><button class="nav-btn" data-action="cal-next" aria-label="다음 달">›</button></div>';
      h += '<div class="month">' + ['일', '월', '화', '수', '목', '금', '토'].map(function (w) { return '<div class="dow">' + w + '</div>'; }).join('');
      for (var i = 0; i < 42; i++) { var d = E.addDays(gs, i); if (i >= 35 && d.slice(0, 7) !== ym) break; h += cell(d, ym); }
      h += '</div><p class="muted" style="margin-top:10px">날짜를 누르면 상세 계획을 볼 수 있어요. ✓ 표시는 그날 강의를 모두 마쳤다는 뜻이에요.</p>';
    } else if (ui.cal === 'week') {
      var ws = E.addDays(cd, -E.dow(cd));
      h += '<div class="cal-head"><button class="nav-btn" data-action="cal-prev" aria-label="이전 주">‹</button><span class="ttl">' + md(ws) + ' ~ ' + md(E.addDays(ws, 6)) + '</span><button class="nav-btn" data-action="cal-next" aria-label="다음 주">›</button></div>';
      for (var j = 0; j < 7; j++) {
        var dj = E.addDays(ws, j), x = day(dj), body;
        if (!x) body = '<span class="muted">계획 기간 밖</span>';
        else if (x.rest) body = '<span class="tag b">휴식</span>';
        else body = (x.lectures.filter(function (l) { return !l.moved || isDone(l.id); }).map(function (l) { return '<div>' + (isDone(l.id) ? '✓ ' : '') + e(lecTitle(l.id)) + ' <span class="meta">' + l.video + '분</span></div>'; }).join('') || '<span class="muted">복습·문제풀이 중심</span>') +
          '<div class="meta">예상 ' + fmt(x.usedMin) + (x.problems ? ' · 문제 ' + x.problems : '') + '</div>';
        h += '<button class="weekrow' + (dj === TODAY ? ' today' : '') + '" data-action="pick-date" data-date="' + dj + '" data-open="1"><span class="d"><span class="meta">' + E.weekdayKo(dj) + '</span><b>' + Number(dj.slice(8)) + '</b></span><span class="grow">' + body + '</span></button>';
      }
    } else {
      h += '<div class="cal-head"><button class="nav-btn" data-action="cal-prev" aria-label="이전 날">‹</button><span class="ttl">' + mdw(cd) + '</span><button class="nav-btn" data-action="cal-next" aria-label="다음 날">›</button></div>' + dayDetail(cd);
    }
    return h + '<button class="btn ghost" data-action="cal-today" style="margin-top:12px">오늘로 이동</button>';
  }

  /* ---------- 화면: 강의 관리 ---------- */
  function lecRow(l) {
    var st = effStatus(l);
    return '<div class="lec" style="min-height:0;padding:9px 0"><span class="grow"><span class="t" style="font-weight:500">' + l.no + '강 · ' + e(l.name) + '</span><br><span class="meta">' + l.origMin + '분 → ' + lecVideo(l) + '분' + (l.speed ? ' (' + l.speed + '배속)' : '') + (l.kind === 'mixed' ? ' · 개념+문제풀이' : '') + (l.custom ? ' · 직접 추가' : '') + '</span><br>' +
      '<span class="tag ' + (st === 'excluded' ? 'p' : 's') + '">' + STATUS[st] + '</span>' + (l.needsCheck && st === 'excluded' ? '<span class="tag p">검증 필요</span>' : '') +
      (st === 'excluded' && l.excludedReason ? '<span class="meta"> ' + e(l.excludedReason) + '</span>' : '') + '</span>' +
      '<button class="mini" data-action="edit-lec" data-id="' + e(l.id) + '">편집</button></div>';
  }
  function viewLectures() {
    var h = '<div class="banner soft">김영편입 공식 강좌 페이지(' + e(D.meta.fetchedAt) + ' 조회) 기준이에요. 여기서 고친 제목·시간·배속·순서·상태는 강의 목록에 바로 보이고, 날짜별 일정에는 ‘일정 다시 맞추기’에서 확인 후 반영돼요.</div>' + staleBanner();
    D.subjects.forEach(function (s) {
      var ls = allBase().filter(function (l) { return l.subject === s.id && l.kind !== 'ot'; }).map(function (l) { return getLec(l.id); })
        .sort(function (a, b) { return (a.seq != null ? a.seq : a.no) - (b.seq != null ? b.seq : b.no); });
      var by = function (f) { return ls.filter(function (l) { return f(effStatus(l)); }); };
      var todo = by(function (x) { return x === 'pending' || x === 'in_progress'; }), fin = by(function (x) { return x === 'completed' || x === 'review'; }), ex = by(function (x) { return x === 'excluded'; });
      h += '<section class="card"><h2>' + e(s.name) + '</h2><p class="meta">' + ls.length + '강 · 남은 강의 ' + todo.length + ' · 수강 완료 ' + fin.length + ' · 제외 ' + ex.length + '</p>' +
        '<details open><summary>남은 강의 (' + todo.length + ')</summary>' + todo.map(lecRow).join('') + '</details>' +
        '<details><summary>수강 완료·복습 필요 (' + fin.length + ')</summary>' + fin.map(lecRow).join('') + '</details>' +
        (ex.length ? '<details><summary>제외한 강의 (' + ex.length + ')</summary>' + ex.map(lecRow).join('') + '</details>' : '') +
        '<button class="btn ghost" style="margin-top:8px" data-action="add-lec" data-s="' + s.id + '">+ 강의 추가</button></section>';
    });
    D.reviewOnlySubjects.forEach(function (s) { h += '<section class="card"><h2>' + e(s.name) + '</h2><p class="meta">' + e(s.note) + '</p></section>'; });
    return h;
  }
  function selectHtml(id, opts, cur) { return '<select id="' + id + '">' + opts.map(function (o) { return '<option value="' + e(o[0]) + '"' + (o[0] === cur ? ' selected' : '') + '>' + e(o[1]) + '</option>'; }).join('') + '</select>'; }
  function sheetLecture(id) {
    var l = getLec(id), st = effStatus(l);
    openSheet('<h2>' + e(lecTitle(id)) + ' 편집</h2><div class="card form">' +
      '<label>강의 제목</label><input type="text" id="f-name" value="' + e(l.name) + '" maxlength="80">' +
      '<label>원본 영상 길이(분)</label><input type="number" id="f-min" min="1" max="400" value="' + l.origMin + '">' +
      '<label>배속 (비우면 기본 1.4배속)</label><input type="number" id="f-speed" min="1" max="3" step="0.1" value="' + (l.speed || '') + '" placeholder="1.4">' +
      '<label>순서 (작을수록 먼저, 현재 ' + (l.seq != null ? l.seq : l.no) + ')</label><input type="number" id="f-seq" step="0.5" value="' + (l.seq != null ? l.seq : l.no) + '">' +
      '<label>상태</label>' + selectHtml('f-status', Object.keys(STATUS).map(function (k) { return [k, STATUS[k]]; }), st) +
      '<p class="meta" id="f-prev"></p><button class="btn" data-action="save-lec" data-id="' + e(id) + '">저장</button>' +
      '<button class="btn ghost" style="margin-top:8px" data-action="reset-lec" data-id="' + e(id) + '">처음 값으로 되돌리기</button>' +
      (l.custom ? '<button class="btn alt" style="margin-top:8px" data-action="del-lec" data-id="' + e(id) + '">이 강의 삭제</button>' : '') + '</div>');
    updatePreview();
  }
  function updatePreview() {
    var m = document.getElementById('f-min'), sp = document.getElementById('f-speed'), p = document.getElementById('f-prev'); if (!m || !p) return;
    var o = Number(m.value) || 0, s = Number(sp.value) || 1.4; p.textContent = o > 0 ? ('시청 시간: ' + o + '분 ÷ ' + s + ' = ' + E.videoMinutes(o, s) + '분 (올림)') : '';
  }
  function sheetAddLecture(sid) {
    openSheet('<h2>' + e(SUBJ[sid].name) + ' 강의 추가</h2><div class="card form"><label>강의 제목</label><input type="text" id="a-name" maxlength="80" placeholder="예: 추가 특강"><label>원본 영상 길이(분)</label><input type="number" id="a-min" min="1" max="400" value="60">' +
      '<label>유형</label>' + selectHtml('a-kind', [['concept', '개념 강의'], ['mixed', '개념+문제풀이 혼합']], 'concept') +
      '<p class="meta">추가한 강의는 과목의 맨 뒤에 붙고, 순서는 나중에 바꿀 수 있어요.</p><button class="btn" data-action="save-new-lec" data-s="' + sid + '">추가</button></div>');
  }

  /* ---------- 화면: 복습 ---------- */
  function noteSort(a, b) {
    var ad = a.retrySuccess === true ? 1 : 0, bd = b.retrySuccess === true ? 1 : 0; if (ad !== bd) return ad - bd;
    var ao = a.retryDate <= TODAY ? 0 : 1, bo = b.retryDate <= TODAY ? 0 : 1; if (ao !== bo) return ao - bo;
    return LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || (a.retryDate < b.retryDate ? -1 : 1);
  }
  function noteCard(n) {
    var l = n.lecId ? getLec(n.lecId) : null, ok = n.retrySuccess === true, due = n.retryDate <= TODAY && !ok;
    return '<div class="note' + (ok ? ' ok' : '') + '"><div class="row"><b class="grow">' + e(n.concept || '(개념명 없음)') + '</b><span class="tag ' + (n.kind === '기출' ? 'p' : 'b') + '">' + (n.kind === '기출' ? '기출문제' : '일반 연습문제') + '</span></div>' +
      '<div class="meta">' + (l ? e(lecTitle(l.id)) + ' · ' : '') + '이해도: ' + e(n.level) + '</div>' +
      (n.problem ? '<div>대표 문제: ' + e(n.problem) + '</div>' : '') + (n.reason ? '<div class="meta">틀린 이유: ' + e(n.reason) + '</div>' : '') +
      '<div class="meta">재도전 ' + md(n.retryDate) + (due ? ' · 지금 다시 해볼 차례' : '') + ' · ' + (ok ? '재도전 성공 ✓' : n.retrySuccess === false ? '재도전 아직 어려움 (' + n.tries.length + '회)' : '아직 재도전 전') + '</div>' +
      '<div class="rate">' + (ok ? '' : '<button data-action="retry" data-id="' + e(n.id) + '" data-ok="1">성공했어요</button><button data-action="retry" data-id="' + e(n.id) + '" data-ok="0">아직 어려워요</button>') +
      '<button data-action="edit-note" data-id="' + e(n.id) + '">편집</button></div></div>';
  }
  function viewReview() {
    var due = TODAY < START ? [] : dueNow(TODAY), notes = S.reviewNotes.slice().sort(noteSort);
    var h = '<section class="card"><h2>강의 복습 (다음 날 · 3일 뒤 · 7일 뒤)</h2>' + (due.length ? '<ul class="plain">' + due.map(function (r) { return reviewRow(r, true); }).join('') + '</ul>' :
      '<p class="muted">지금 복습할 항목이 없어요. 강의를 완료하면 자동으로 복습이 생겨요.</p>') + '<p class="meta">복습 후 이해도를 고르면 ‘조금 헷갈림’은 3일 뒤, ‘다시 공부 필요’는 내일 다시 해볼 항목으로 아래에 올라가요. 이해함은 그대로 마무리돼요.</p></section>';
    h += '<section class="card"><div class="row"><h2 class="grow" style="margin:0">틀린 문제 · 재도전</h2><button class="mini" data-action="add-note">+ 추가</button></div>' +
      (notes.length ? notes.map(noteCard).join('') : '<p class="muted">아직 기록이 없어요. 모르는 부분을 발견해서 적어 두는 것도 학습의 일부예요.</p>') + '</section>';
    var cnt = { '기출': 0, '일반': 0 }; S.reviewNotes.forEach(function (n) { cnt[n.kind === '기출' ? '기출' : '일반']++; });
    return h + '<p class="meta" style="text-align:center">기출문제 ' + cnt['기출'] + '건 · 일반 연습문제 ' + cnt['일반'] + '건</p>';
  }
  function sheetNote(id) {
    var n = id ? S.reviewNotes.find(function (x) { return x.id === id; }) : { concept: '', lecId: '', problem: '', kind: '일반', reason: '', retryDate: E.addDays(TODAY, 3), level: '조금 헷갈림' };
    var lecOpts = [['', '(선택 안 함)']].concat(allBase().filter(function (l) { return l.kind !== 'ot'; }).map(function (l) { return [l.id, lecTitle(l.id) + ' · ' + getLec(l.id).name]; }));
    openSheet('<h2>' + (id ? '기록 편집' : '틀린 문제 기록') + '</h2><div class="card form">' +
      '<label>개념명</label><input type="text" id="n-concept" value="' + e(n.concept) + '" maxlength="60">' +
      '<label>관련 강의</label>' + selectHtml('n-lec', lecOpts, n.lecId || '') +
      '<label>대표 문제</label><input type="text" id="n-problem" value="' + e(n.problem) + '" maxlength="120" placeholder="예: 2025 한양대 12번">' +
      '<label>구분</label>' + selectHtml('n-kind', [['일반', '일반 연습문제'], ['기출', '기출문제']], n.kind) +
      '<label>틀린 이유</label><textarea id="n-reason" maxlength="200">' + e(n.reason) + '</textarea>' +
      '<label>이해도</label>' + selectHtml('n-level', LEVELS.map(function (x) { return [x, x]; }), n.level) +
      '<label>재도전 날짜</label><input type="date" id="n-date" value="' + e(n.retryDate) + '">' +
      '<button class="btn" style="margin-top:10px" data-action="save-note" data-id="' + e(id || '') + '">저장</button>' +
      (id ? '<button class="btn alt" style="margin-top:8px" data-action="del-note" data-id="' + e(id) + '">삭제</button>' : '') + '</div>');
  }

  /* ---------- 시트·설정 ---------- */
  function openSheet(html) { document.getElementById('sheet-body').innerHTML = '<button class="close" data-action="close-sheet" aria-label="닫기">✕</button>' + html; document.getElementById('sheet').hidden = false; }
  function closeSheet() { document.getElementById('sheet').hidden = true; ui.timerOpen = false; }
  function sheetOpen() { return !document.getElementById('sheet').hidden; }
  function sheetSettings() {
    var ex = S.settings.exams;
    openSheet('<h2>설정</h2><div class="card form"><h3>시험일</h3><p class="meta">날짜가 바뀌면 여기서 수정하세요. 일정은 가장 이른 시험 전날까지 만들어요.</p>' +
      ex.map(function (x, i) { return '<label>시험 ' + (i + 1) + ' 대학</label><input type="text" id="en' + i + '" value="' + e(x.name) + '" maxlength="20"><label>날짜</label><input type="date" id="ed' + i + '" value="' + e(x.date) + '">'; }).join('') +
      '<button class="btn" style="margin-top:12px" data-action="save-exams">저장</button></div>' +
      '<div class="card"><h3>현재 일정 기준</h3><p class="meta">시작 ' + mdw(START) + ' · 개념 완강 목표 ' + mdw(DEADLINE) + '<br>하루 공부 가능 시간 ' + S.plan.settings.minHours + '~' + S.plan.settings.maxHours + '시간(점진적 증가) · 매주 수요일 휴식(시작일 제외)</p><button class="btn alt" data-action="open-replan" data-restart="0">일정 조건 바꾸기·다시 맞추기</button></div>' +
      '<div class="card"><h3>데이터 관리</h3><p class="meta">모든 기록은 이 브라우저(LocalStorage)에 자동 저장돼요. 기기를 바꾸거나 브라우저 데이터를 지우기 전에 백업을 받아 두세요.</p>' +
      '<button class="btn" data-action="backup-download">백업 다운로드 (JSON)</button><label class="btn alt" style="display:block;text-align:center;margin-top:8px">백업 불러오기<input type="file" id="import-file" accept=".json,application/json" hidden></label>' +
      '<button class="btn ghost" style="margin-top:8px" data-action="reset-all">모든 데이터 초기화</button></div>');
  }
  function sheetStart() {
    var dk = activeDay(), d = day(dk), first = d && d.lectures[0];
    openSheet('<h2>공부 시작</h2>' + (first ? '<div class="card"><h3>오늘의 첫 강의</h3><div class="t">' + e(lecTitle(first.id)) + ' · ' + e(lecName(first.id)) + '</div><p class="meta">1.4배속 ' + first.video + '분</p></div>' : '<div class="card"><p class="muted">오늘은 새 강의 없이 복습 중심이에요.</p></div>') +
      '<div class="card"><h3>시작 루틴</h3>' + (S.routine[0] ? S.routine[0].items.map(function (it) {
        var on = dailyOf(dk).routine[it.id];
        return '<div class="lec" style="min-height:48px;padding:8px 0"><label><input type="checkbox" data-action="routine" data-k="' + e(it.id) + '"' + (on ? ' checked' : '') + '><span class="grow">' + e(it.label) + '</span></label></div>';
      }).join('') : '') + '</div><button class="btn" data-action="timer-open" data-id="' + (first ? e(first.id) : '') + '">타이머로 시작하기</button><button class="btn alt" style="margin-top:8px" data-action="tm-five">5분만 시작하기</button>');
  }

  /* ---------- STEP D: 일정 다시 맞추기 ---------- */
  function fromDay() { return TODAY < START ? START : TODAY; }
  function missedList() {
    if (TODAY < START) return [];
    var out = [];
    S.plan.days.forEach(function (d) { if (d.date < TODAY) d.lectures.forEach(function (x) { if (!x.moved && !isDone(x.id) && out.indexOf(x.id) < 0) out.push(x.id); }); });
    return out;
  }
  function staleInfo() {
    var r = [], missed = missedList(), from = fromDay();
    if (missed.length) r.push('예정보다 미뤄진 강의 ' + missed.length + '개');
    if (S.plan.sig !== sigNow()) r.push('강의 정보 변경');
    var a = JSON.stringify(S.plan.moods || {}), b = JSON.stringify(moodsFrom(from)); // 과거 날짜는 비교에서 제외
    var pm = {}; Object.keys(S.plan.moods || {}).forEach(function (d) { if (d >= from) pm[d] = S.plan.moods[d]; });
    if (JSON.stringify(pm) !== b) r.push('컨디션 모드 선택');
    return { reasons: r, missed: missed.length };
  }
  function staleBanner() {
    var st = staleInfo(); if (!st.reasons.length) return '';
    return '<div class="banner soft"><b>계획이 달라져도 다시 이어갈 수 있어요.</b><br>달라진 점: ' + e(st.reasons.join(' · ')) + '. 남은 강의를 다시 배치해서 전후를 비교해 볼 수 있어요. 확인하기 전에는 아무것도 바뀌지 않아요.' +
      '<div style="margin-top:8px"><button class="mini" data-action="open-replan" data-restart="' + (st.missed ? 1 : 0) + '">' + (st.missed ? '오늘부터 다시 시작하기' : '일정 다시 맞추기') + '</button></div></div>';
  }
  function nextPending() {
    var from = fromDay(), hit = null;
    S.plan.days.forEach(function (d) { if (!hit && d.date >= from) d.lectures.forEach(function (x) { if (!hit && !isDone(x.id)) hit = x; }); });
    return hit;
  }
  function newRp(restart, ov) {
    return { cfg: JSON.parse(JSON.stringify(S.planCfg)), ov: Object.assign({}, S.overrides, ov || {}), restart: !!restart, res: null, formOpen: false };
  }
  function computeReplan(rp) {
    var from = fromDay(), ov = {};
    Object.keys(rp.ov).forEach(function (k) { ov[k] = Object.assign({}, rp.ov[k]); });
    Object.keys(S.daily).forEach(function (d) { if (d >= from && S.daily[d].mood) ov[d] = Object.assign(ov[d] || {}, { mode: S.daily[d].mood }); });
    var history = {}; S.plan.days.forEach(function (d) { history[d.date] = d.lectures.map(function (x) { return x.id; }); });
    var res = E.buildPlan({ lectures: mergedLectures(), settings: planSettings(rp.cfg), overrides: ov, completions: S.completions, history: history,
      reviewDone: S.reviewDone, fromDate: from, softLanding: rp.restart ? { days: 2, hours: 5 } : null });
    var old = {}; S.plan.days.forEach(function (d) { d.lectures.forEach(function (x) { if (!x.moved && !isDone(x.id)) old[x.id] = d.date; }); });
    rp.res = res; rp.from = from; rp.diff = E.diffPlans({ placed: old }, { placed: res.placed });
    return rp;
  }
  function applyReplan(rp) {
    var res = rp.res, keep = S.plan.days.filter(function (d) { return d.date < rp.from; }).map(function (d) {
      return Object.assign({}, d, { lectures: d.lectures.map(function (x) { return isDone(x.id) || x.moved ? x : Object.assign({}, x, { moved: true }); }) });
    }), fresh = res.days.filter(function (d) { return d.date >= rp.from; });
    var log = (S.plan.log || []).concat([{ at: new Date().toISOString(), from: rp.from, moved: rp.diff.moved.length, added: rp.diff.added.length, removed: rp.diff.removed.length, feasible: res.feasible }]).slice(-10);
    S.planCfg = rp.cfg; S.overrides = rp.ov;
    S.plan = snapshot(res, keep.concat(fresh), log);
    START = S.plan.settings.startDate; DEADLINE = S.plan.settings.conceptDeadline;
    save();
  }
  function lectureLabel(id) { var l = getLec(id); return l ? lecTitle(id) : id; }
  function hoursNeeded(rp) {
    for (var h = rp.cfg.maxHours; h <= 12; h += 0.25) { var t = JSON.parse(JSON.stringify(rp)); t.cfg.maxHours = h; computeReplan(t); if (t.res.feasible) return h; }
    return null;
  }
  function replanResult(rp) {
    var res = rp.res, df = rp.diff, h = '';
    if (res.feasible) h += '<div class="banner" style="background:var(--sage-l);border-color:#C9DAC3">✓ 남은 강의를 ' + md(res.finishDate || rp.cfg.deadline) + '까지 모두 배치할 수 있어요.</div>';
    else {
      var a = res.alternatives || {}, need = hoursNeeded(rp);
      h += '<div class="banner"><b>이 조건으로는 ' + md(rp.cfg.deadline) + '까지 모든 강의를 배치할 수 없어요.</b><br>못 들어간 강의: ' + res.unplaced.slice(0, 6).map(lectureLabel).map(e).join(', ') + (res.unplaced.length > 6 ? ' 외 ' + (res.unplaced.length - 6) + '개' : '') + ' (' + res.unplaced.length + '개)<br>' +
        '<div class="rate">' + (a.extension ? '<button data-action="rp-ext" data-date="' + a.extension.date + '">완강 목표일 ' + md(a.extension.date) + '로 연장</button>' : '') +
        (need ? '<button data-action="rp-hours" data-h="' + need + '">하루 최대 ' + need + '시간으로</button>' : '') +
        '<button data-action="rp-low">우선순위 낮은 강의 재검토</button></div></div>';
    }
    h += '<div class="grid2"><div class="stat"><span class="meta">날짜가 바뀌는 강의</span><b>' + df.moved.length + '개</b></div><div class="stat"><span class="meta">새로 배치</span><b>' + df.added.length + '개</b></div>' +
      '<div class="stat"><span class="meta">빠지는 강의</span><b>' + df.removed.length + '개</b></div><div class="stat"><span class="meta">그대로</span><b>' + df.unchanged + '개</b></div></div>';
    var li = function (x, txt) { return '<li>' + e(lectureLabel(x.id)) + ' <span class="meta">' + txt + '</span></li>'; };
    var rows = df.moved.map(function (x) { return li(x, md(x.from) + ' → ' + md(x.to)); }).concat(df.added.map(function (x) { return li(x, '→ ' + md(x.to) + ' (새로 배치)'); }),
      df.removed.map(function (x) { return li(x, md(x.from) + ' → ' + (res.unplaced.indexOf(x.id) >= 0 ? '배치 못 함' : '일정에서 빠짐')); }));
    if (rows.length) h += '<details style="margin-top:8px"' + (rows.length <= 8 ? ' open' : '') + '><summary>변경 내용 보기 (' + rows.length + ')</summary><ul class="plain">' + rows.join('') + '</ul></details>';
    else h += '<p class="muted">바뀌는 강의가 없어요.</p>';
    var wk = res.days.filter(function (d) { return d.date >= rp.from && d.mode; });
    if (wk.length) h += '<p class="meta">컨디션 모드가 반영된 날: ' + wk.map(function (d) { return md(d.date) + ' ' + (MODES[d.mode] || {}).n; }).join(', ') + '</p>';
    h += '<p class="meta">이미 완료한 강의와 지난 날짜의 기록은 그대로 두고, ' + md(rp.from) + '부터의 남은 강의만 다시 배치해요.</p>';
    return h;
  }
  function sheetReplan() {
    var rp = ui.rp; if (!rp.res) computeReplan(rp);
    var c = rp.cfg, wd = ['일', '월', '화', '수', '목', '금', '토'];
    var ovRest = Object.keys(rp.ov).filter(function (d) { return d >= rp.from && rp.ov[d].rest !== undefined; }).sort();
    openSheet('<h2>일정 다시 맞추기</h2><p class="muted">' + (rp.restart ? '며칠 쉬었어도 괜찮아요. 오늘부터 가볍게 이어갈 수 있게 처음 이틀은 조금 적게 배치해요.' : '바뀐 상황에 맞춰 남은 강의를 다시 배치해 볼게요.') + ' 아래 미리보기를 확인한 뒤에만 적용돼요.</p>' +
      '<div class="card form"><details' + (rp.formOpen ? ' open' : '') + '><summary data-action="rp-form">조건 바꾸기</summary>' +
      '<label>하루 최대 공부 시간(시간)</label><input type="number" id="rp-max" min="3" max="12" step="0.25" value="' + c.maxHours + '">' +
      '<label>매주 쉬는 요일</label><div class="rate">' + wd.map(function (n, i) { return '<label class="chk"><input type="checkbox" class="rp-wd" value="' + i + '"' + (c.restWeekdays.indexOf(i) >= 0 ? ' checked' : '') + '>' + n + '</label>'; }).join('') + '</div>' +
      '<label>개념 완강 목표일</label><input type="date" id="rp-deadline" value="' + e(c.deadline) + '">' +
      '<label>개별 쉬는 날·휴식 해제</label>' + (ovRest.length ? ovRest.map(function (d) { return '<div class="row" style="margin:4px 0"><span class="grow">' + mdw(d) + ' · ' + (rp.ov[d].rest ? '쉬는 날' : '휴식 해제') + '</span><button class="mini del" data-action="rp-ov-del" data-date="' + d + '">취소</button></div>'; }).join('') : '<p class="meta">지정한 날이 없어요.</p>') +
      '<div class="row"><input type="date" id="rp-ov-date"><button class="mini" data-action="rp-ov-add">쉬는 날 추가</button></div>' +
      '<button class="btn alt" style="margin-top:10px" data-action="rp-recalc">조건 적용해서 다시 미리보기</button></details></div>' +
      '<div class="card">' + replanResult(rp) + '</div>' +
      '<button class="btn" data-action="rp-apply">' + (rp.res.feasible ? '이 일정으로 적용' : '그래도 이 일정으로 적용') + '</button>' +
      '<button class="btn ghost" style="margin-top:8px" data-action="close-sheet">취소 (아무것도 바뀌지 않아요)</button>');
  }
  function readRpForm() {
    var rp = ui.rp, mx = Number(val('rp-max')), dl = val('rp-deadline');
    if (!(mx >= 3 && mx <= 12)) { alert('하루 최대 공부 시간은 3~12시간 사이로 입력해 주세요.'); return false; }
    if (!dl || dl >= examDates()[0]) { alert('완강 목표일은 가장 이른 시험일(' + md(examDates()[0]) + ')보다 앞이어야 해요.'); return false; }
    rp.cfg.maxHours = mx; rp.cfg.deadline = dl;
    rp.cfg.restWeekdays = Array.prototype.map.call(document.querySelectorAll('.rp-wd:checked'), function (x) { return Number(x.value); });
    return true;
  }
  function openReplan(restart, ov) { ui.rp = newRp(restart, ov); computeReplan(ui.rp); ui.sheetFn = sheetReplan; sheetReplan(); }

  /* ---------- STEP E: 타이머 ---------- */
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  function nowMs() { return Date.now(); }
  function dateOfMs(ms) { return qs.get('today') ? TODAY : E.todaySeoul(new Date(ms)); }
  function tElapsed(t) { return t.accumSec + (t.runningSince ? (nowMs() - t.runningSince) / 1000 : 0); }
  function clock(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), x = sec % 60; return (h ? h + ':' + pad2(m) : m) + ':' + pad2(x); }
  var KIND = { study: '집중 공부', five: '5분 시작하기', break: '휴식' };
  function startTimer(kind, lecId, targetMin) {
    var t = nowMs();
    S.timer = { kind: kind, lecId: lecId || null, targetSec: targetMin ? targetMin * 60 : null, accumSec: 0, runningSince: t, startedAt: t, lastSeen: t, reached: false, recovered: false };
    save();
  }
  function pauseTimer() { var T = S.timer; if (!T || !T.runningSince) return; T.accumSec = tElapsed(T); T.runningSince = null; save(); }
  function resumeTimer() { var T = S.timer; if (!T || T.runningSince) return; T.runningSince = nowMs(); T.recovered = false; save(); }
  function stopTimer() {
    var T = S.timer; if (!T) return 0;
    var sec = Math.round(tElapsed(T));
    if (sec >= 10) S.sessions.push({ id: uid('s'), date: dateOfMs(T.startedAt), lecId: T.lecId, kind: T.kind, sec: sec, startedAt: T.startedAt });
    S.timer = null; save(); return sec;
  }
  function studySecOn(date) { return S.sessions.reduce(function (a, x) { return a + (x.date === date && x.kind !== 'break' ? x.sec : 0); }, 0); }
  function activeSec(date) { // 저장된 기록 + 지금 진행 중인 공부
    var extra = S.timer && S.timer.kind !== 'break' && dateOfMs(S.timer.startedAt) === date ? tElapsed(S.timer) : 0;
    return studySecOn(date) + extra;
  }
  function firstUndone() { var np = nextPending(); return np ? np.id : ''; }
  function recoverTimer() { // 브라우저가 닫힌 채 끝난 타이머: 마지막으로 확인된 시점까지만 복구하고 일시정지
    var T = S.timer; if (!T || !T.runningSince) return;
    T.accumSec += Math.max(0, (T.lastSeen - T.runningSince) / 1000); T.runningSince = null; T.recovered = true; save();
  }
  function tick() {
    var T = S.timer;
    if (T) {
      if (T.runningSince) {
        T.lastSeen = nowMs();
        if (T.targetSec && !T.reached && tElapsed(T) >= T.targetSec) {
          T.accumSec = T.targetSec; T.runningSince = null; T.reached = true;
          try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (x) { /* 진동 미지원 */ }
          save(); if (ui.timerOpen) sheetTimer(); updateMini(); return;
        }
        if (nowMs() % 5000 < 1000) save();
      }
      var d = document.getElementById('tm-disp');
      if (d) { var el = tElapsed(T); d.textContent = T.targetSec ? clock(Math.max(0, T.targetSec - el)) : clock(el);
        var b = document.getElementById('tm-bar'); if (b && T.targetSec) b.style.width = Math.min(100, el / T.targetSec * 100) + '%'; }
    }
    updateMini();
  }
  function updateMini() {
    var m = document.getElementById('minibar'), T = S.timer;
    if (!T) { m.hidden = true; return; }
    var el = tElapsed(T), shown = T.targetSec ? Math.max(0, T.targetSec - el) : el;
    m.hidden = false;
    m.textContent = (T.reached ? '⏸ ' : T.runningSince ? '▶ ' : '⏸ ') + KIND[T.kind] + ' ' + clock(shown) + (T.lecId && getLec(T.lecId) ? ' · ' + lecTitle(T.lecId) : '') + (T.reached ? ' · 끝났어요' : '');
  }
  function lecOptions(sel) {
    var d = day(activeDay()), ids = [];
    if (d) d.lectures.forEach(function (x) { if (!x.moved && ids.indexOf(x.id) < 0) ids.push(x.id); });
    if (sel && ids.indexOf(sel) < 0 && getLec(sel)) ids.push(sel);
    return [['', '(강의 없이 자유 공부)']].concat(ids.map(function (id) { return [id, lecTitle(id) + ' · ' + lecName(id)]; }));
  }
  function sheetTimer() {
    ui.timerOpen = true; ui.sheetFn = sheetTimer;
    var T = S.timer, c = ui.tcfg, h = '<h2>타이머</h2>', today = activeDay();
    var est = stats(day(today)).total;
    var summary = '<p class="meta">오늘 실제 측정 <b>' + fmt(activeSec(today) / 60) + '</b>' + (est ? ' · 예상 ' + fmt(est) : '') + '</p>';
    if (!T) {
      h += (ui.tmsg ? '<div class="banner" style="background:var(--sage-l);border-color:#C9DAC3">' + e(ui.tmsg) + '</div>' : '') + summary +
        '<div class="card form"><label>공부할 강의</label>' + selectHtml('tm-lec', lecOptions(c.lecId), c.lecId) +
        '<label>집중 시간</label><div class="seg">' + [25, 50, 0].map(function (m) { return '<button data-action="tm-focus" data-m="' + m + '" class="' + ((c.focus === m) ? 'on' : '') + '">' + (m ? m + '분' : '직접 설정') + '</button>'; }).join('') + '</div>' +
        (c.focus === 0 ? '<label>집중 시간(분)</label><input type="number" id="tm-custom" min="1" max="180" value="' + c.custom + '">' : '') +
        '<button class="btn" style="margin-top:12px" data-action="tm-start">시작</button>' +
        '<button class="btn alt" style="margin-top:8px" data-action="tm-five">5분만 시작하기</button></div>' +
        '<div class="card"><h3>휴식 타이머</h3><div class="rate"><button data-action="tm-break" data-m="5">5분</button><button data-action="tm-break" data-m="10">10분</button><button data-action="tm-break" data-m="15">15분</button></div></div>' +
        '<p class="meta">타이머가 도는 동안 앱을 닫아도 마지막으로 확인된 시점까지의 기록은 복구돼요. 영상 재생 시간이 아니라 실제 공부한 시간을 재요.</p>';
    } else {
      var el = tElapsed(T), shown = T.targetSec ? Math.max(0, T.targetSec - el) : el;
      h += summary + '<div class="card" style="text-align:center"><div class="meta">' + KIND[T.kind] + (T.lecId && getLec(T.lecId) ? ' · ' + e(lecTitle(T.lecId)) + ' ' + e(lecName(T.lecId)) : '') + '</div>' +
        '<div id="tm-disp" class="bigclock">' + clock(shown) + '</div>' + (T.targetSec ? '<div class="bar"><i id="tm-bar" style="width:' + Math.min(100, el / T.targetSec * 100) + '%"></i></div>' : '<div class="meta">경과 시간</div>') +
        (T.recovered ? '<div class="banner soft" style="text-align:left">닫혀 있던 동안은 빼고 마지막으로 확인된 시점까지 ' + fmt(el / 60) + '을 복구했어요. 일시정지 상태예요.</div>' : '');
      if (T.reached) {
        if (T.kind === 'five') h += '<p><b>5분 시작 완료! 여기까지 시작한 것만으로도 충분해요.</b><br>계속할지 골라 보세요.</p><div class="rate" style="justify-content:center"><button data-action="tm-after" data-k="more">25분 더 해볼게요</button><button data-action="tm-after" data-k="rest">잠깐 쉴게요</button><button data-action="tm-after" data-k="end">여기까지 할게요</button></div>';
        else if (T.kind === 'study') h += '<p><b>집중 시간이 끝났어요.</b></p><div class="rate" style="justify-content:center"><button data-action="tm-after" data-k="rest">5분 쉬기</button><button data-action="tm-after" data-k="extend">더 이어가기</button><button data-action="tm-after" data-k="end">종료하고 저장</button></div>';
        else h += '<p><b>휴식이 끝났어요.</b></p><div class="rate" style="justify-content:center"><button data-action="tm-after" data-k="again">다시 집중하기</button><button data-action="tm-after" data-k="end">종료</button></div>';
      } else {
        h += '<div class="rate" style="justify-content:center">' + (T.runningSince ? '<button data-action="tm-pause">일시정지</button>' : '<button data-action="tm-resume">계속하기</button>') + '<button data-action="tm-stop">종료하고 ' + (T.kind === 'break' ? '' : '기록 ') + '저장</button></div>';
      }
      h += '</div>';
    }
    openSheet(h);
  }
  function openTimer(lecId) { if (lecId !== undefined && !S.timer) ui.tcfg.lecId = lecId; ui.tmsg = ''; sheetTimer(); }
  function startFive() {
    var lec = firstUndone();
    if (S.timer) { sheetTimer(); return; }
    ui.tcfg.lecId = lec; startTimer('five', lec, 5); ui.tmsg = ''; sheetTimer(); updateMini();
  }
  function timerAfter(k) {
    var T = S.timer, lec = T.lecId, kind = T.kind;
    if (k === 'extend') { T.targetSec = null; T.reached = false; T.runningSince = nowMs(); save(); return sheetTimer(); }
    var sec = stopTimer(), mins = fmt(sec / 60);
    if (k === 'more') { startTimer('study', lec, 25); return sheetTimer(); }
    if (k === 'rest') { startTimer('break', lec, 5); return sheetTimer(); }
    if (k === 'again') { startTimer('study', lec, ui.tcfg.focus || ui.tcfg.custom); return sheetTimer(); }
    ui.tmsg = kind === 'break' ? '휴식을 마쳤어요.' : (kind === 'five' ? '시작한 것만으로 충분해요. ' : '') + mins + ' 기록했어요. 오늘도 한 걸음 나아갔어요.';
    sheetTimer();
  }

  /* ---------- STEP E: 통계 ---------- */
  function scopeLectures() { return allBase().filter(function (l) { return l.kind !== 'ot'; }).map(function (l) { return getLec(l.id); }).filter(function (l) { return effStatus(l) !== 'excluded'; }); }
  function pctBar(p, label) { return '<div class="bar"><i style="width:' + Math.max(0, Math.min(100, p)) + '%"></i></div><div class="meta">' + label + '</div>'; }
  function weekStart(d) { return E.addDays(d, -E.dow(d)); }
  function viewStats() {
    var h = '', sc = scopeLectures(), done = sc.filter(function (l) { return isDone(l.id); });
    h += '<section class="card"><h2>강의 완료율</h2>' + pctBar(sc.length ? done.length / sc.length * 100 : 0, '전체 ' + done.length + ' / ' + sc.length + '강 (' + (sc.length ? Math.round(done.length / sc.length * 100) : 0) + '%)');
    D.subjects.forEach(function (sb) {
      var ls = sc.filter(function (l) { return l.subject === sb.id; }), dn = ls.filter(function (l) { return isDone(l.id); }).length;
      h += '<p style="margin:12px 0 0"><b>' + e(sb.name) + '</b></p>' + pctBar(ls.length ? dn / ls.length * 100 : 0, dn + ' / ' + ls.length + '강');
    });
    h += '<p class="meta">제외한 강의는 계산에서 빼요. 완료율은 실제로 체크한 강의만 센 값이에요.</p></section>';

    // 공부 시간
    var total = S.sessions.reduce(function (a, x) { return a + (x.kind !== 'break' ? x.sec : 0); }, 0) + (S.timer && S.timer.kind !== 'break' ? tElapsed(S.timer) : 0);
    var bars = [], mx = 1, last7 = 0, i;
    for (i = 6; i >= 0; i--) { var d = E.addDays(TODAY, -i), m = Math.round(activeSec(d) / 60); bars.push({ d: d, m: m }); mx = Math.max(mx, m); last7 += m; }
    h += '<section class="card"><h2>공부 시간 (실제 측정)</h2><div class="grid2"><div class="stat"><span class="meta">누적</span><b>' + fmt(total / 60) + '</b></div><div class="stat"><span class="meta">최근 7일</span><b>' + fmt(last7) + '</b></div></div>' +
      '<div class="chart">' + bars.map(function (b) { return '<div class="col"><span class="v">' + (b.m || '') + '</span><i style="height:' + Math.round(b.m / mx * 80) + 'px"></i><span class="l">' + Number(b.d.slice(8)) + '</span></div>'; }).join('') + '</div>' +
      '<p class="meta">막대는 분 단위예요. 쉬는 날이나 기록이 없는 날은 비어 있을 뿐이에요. 영상 재생 시간이 아니라 타이머로 잰 시간만 더해요.</p></section>';

    // 주간 계획 달성률
    var wk = {}, ids = {};
    S.plan.days.forEach(function (dy) { dy.lectures.forEach(function (x) { if (x.moved && !isDone(x.id)) return; var k = weekStart(dy.date); (wk[k] = wk[k] || {})[x.id] = 1; }); });
    var weeks = Object.keys(wk).sort().filter(function (k) { return k <= weekStart(TODAY); }).slice(-5).reverse();
    h += '<section class="card"><h2>주간 계획 달성률</h2>' + (weeks.length ? weeks.map(function (k) {
      var arr = Object.keys(wk[k]), dn = arr.filter(isDone).length, cur = k === weekStart(TODAY);
      return '<p style="margin:10px 0 0"><b>' + md(k) + ' 주' + (cur ? ' (이번 주)' : '') + '</b></p>' + pctBar(arr.length ? dn / arr.length * 100 : 0, arr.length + '강 중 ' + dn + '강 완료');
    }).join('') : '<p class="muted">학습이 시작되면 주간 기록이 쌓여요.</p>') + '<p class="meta">계획한 강의 중 실제로 완료한 비율이에요. 쉬는 날을 포함해 계산하지 않아요.</p></section>';

    // 복습 현황
    h += '<section class="card"><h2>과목별 복습 현황</h2>' + D.subjects.map(function (sb) {
      var doneRev = S.reviewDone.filter(function (k) { var l = getLec(k.split(':')[0]); return l && l.subject === sb.id; }).length;
      var dueN = (TODAY < START ? [] : dueNow(TODAY)).filter(function (r) { return getLec(r.lecId).subject === sb.id; }).length;
      var ns = S.reviewNotes.filter(function (n) { var l = n.lecId && getLec(n.lecId); return l && l.subject === sb.id; });
      var ok = ns.filter(function (n) { return n.retrySuccess === true; }).length;
      return '<p style="margin:8px 0"><b>' + e(sb.name) + '</b><br><span class="meta">복습 완료 ' + doneRev + '회 · 지금 복습 대기 ' + dueN + '개 · 재도전 성공 ' + ok + '/' + ns.length + '</span></p>';
    }).join('') + '</section>';

    // 목표 완강일 대비
    var seen = {}, planned = 0, plannedDone = 0;
    S.plan.days.forEach(function (dy) { if (dy.date <= TODAY) dy.lectures.forEach(function (x) { if (!seen[x.id]) { seen[x.id] = 1; planned++; if (isDone(x.id)) plannedDone++; } }); });
    var remain = sc.filter(function (l) { return !isDone(l.id); }), cost = { video: 0, note: 0, example: 0, brk: 0, total: 0 };
    remain.forEach(function (l) { var c = E.lectureCost(l, S.plan.settings); cost.video += c.video; cost.note += c.note; cost.example += c.example; cost.brk += c.brk; cost.total += c.total; });
    var left = Math.max(0, E.diffDays(TODAY < START ? START : TODAY, DEADLINE) + 1), studyDays = S.plan.days.filter(function (dy) { return dy.date >= (TODAY < START ? START : TODAY) && dy.date <= DEADLINE && !dy.rest; }).length;
    h += '<section class="card"><h2>목표 완강일 대비 진행</h2><p class="meta" style="margin:0">개념 완강 목표 ' + mdw(DEADLINE) + ' · ' + (left > 0 ? '남은 날 ' + left + '일 (공부하는 날 ' + studyDays + '일)' : '목표일이 지났어요') + '</p>' +
      pctBar(planned ? plannedDone / planned * 100 : 0, planned ? ('오늘까지 계획된 ' + planned + '강 중 ' + plannedDone + '강 완료') : '아직 학습 시작 전이에요') +
      (planned && plannedDone < planned ? '<p class="meta">계획보다 ' + (planned - plannedDone) + '강이 남아 있어요. ‘일정 다시 맞추기’로 언제든 다시 배치할 수 있어요.</p>' : (planned ? '<p class="meta">계획대로 잘 이어가고 있어요.</p>' : '')) +
      '<h3>남은 강의 예상 총 소요 시간</h3><div class="grid2"><div class="stat"><span class="meta">남은 강의</span><b>' + remain.length + '강</b></div><div class="stat"><span class="meta">예상 공부 시간</span><b>' + fmt(cost.total) + '</b></div></div>' +
      '<p class="meta">영상(1.4배속) ' + fmt(cost.video) + ' · 일시정지·필기 ' + fmt(cost.note) + ' · 예제 ' + fmt(cost.example) + ' · 휴식 ' + fmt(cost.brk) + '</p></section>';
    return h;
  }

  /* ---------- STEP E: 백업·초기화 ---------- */
  function backupDownload() {
    var payload = { app: 'transfer-math-planner', version: 2, exportedAt: new Date().toISOString(), state: S };
    var blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'planner-backup-' + TODAY + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function validBackup(p) {
    return p && p.app === 'transfer-math-planner' && p.state && typeof p.state === 'object' && p.state.plan && Array.isArray(p.state.plan.days) &&
      p.state.completions && typeof p.state.completions === 'object' && Array.isArray(p.state.sessions || []);
  }
  function backupImport(file) {
    var r = new FileReader();
    r.onload = function () {
      var p; try { p = JSON.parse(r.result); } catch (x) { alert('JSON 파일을 읽을 수 없어요. 이 앱에서 받은 백업 파일인지 확인해 주세요.'); return; }
      if (!validBackup(p)) { alert('이 앱의 백업 파일이 아니에요. 현재 데이터는 그대로예요.'); return; }
      if (!confirm('백업 파일(' + (p.exportedAt || '').slice(0, 10) + ')으로 현재 데이터를 모두 바꿀까요?\n지금 데이터는 사라져요. 먼저 백업을 받아 두면 안전해요.')) return;
      try { localStorage.setItem(KEY, JSON.stringify(Object.assign(defaultState(), p.state))); } catch (x) { alert('저장에 실패했어요. 현재 데이터는 그대로예요.'); return; }
      location.reload();
    };
    r.readAsText(file);
  }
  function resetAll() {
    if (!confirm('모든 데이터를 지울까요?\n강의 완료, 복습·틀린 문제, 루틴, 타이머 기록, 일정이 모두 삭제돼요. 되돌릴 수 없어요.\n(먼저 백업 다운로드를 권해요)')) return;
    if (!confirm('정말 처음 상태로 초기화할까요?')) return;
    try { localStorage.removeItem(KEY); } catch (x) { /* 무시 */ }
    location.reload();
  }

  /* ---------- 렌더 ---------- */
  function render() {
    var v = document.getElementById('view'), html, y = window.scrollY;
    if (ui.tab === 'today') html = viewToday();
    else if (ui.tab === 'calendar') html = viewCalendar();
    else if (ui.tab === 'lectures') html = viewLectures();
    else if (ui.tab === 'review') html = viewReview();
    else html = viewStats();
    v.innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll('#tabbar button'), function (b) { b.classList.toggle('on', b.dataset.tab === ui.tab); });
    if (ui.keep) { window.scrollTo(0, y); ui.keep = false; }
  }
  function refresh() { ui.keep = true; var s = sheetOpen(), cur = ui.sheetFn; render(); if (s && cur) cur(); }
  function go(tab) { ui.tab = tab; location.hash = tab; window.scrollTo(0, 0); render(); }
  function shiftCal(dir) {
    var cd = ui.calDate;
    if (ui.cal === 'month') { var p = cd.split('-').map(Number), m = p[1] - 1 + dir, y = p[0] + Math.floor(m / 12); m = ((m % 12) + 12) % 12; ui.calDate = y + '-' + String(m + 1).padStart(2, '0') + '-01'; }
    else ui.calDate = E.addDays(cd, (ui.cal === 'week' ? 7 : 1) * dir);
  }
  function val(id) { var x = document.getElementById(id); return x ? x.value : ''; }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-action],[data-tab]'); if (!t) return;
    if (t.dataset.tab) return go(t.dataset.tab);
    var a = t.dataset.action, id = t.dataset.id;
    if (a === 'toggle-lec' || a === 'routine') return;
    if (a === 'mood') { var dd = dailyOf(activeDay()); dd.mood = dd.mood === t.dataset.k ? null : t.dataset.k; save(); ui.keep = true; render(); }
    else if (a === 'cal-mode') { ui.cal = t.dataset.k; render(); }
    else if (a === 'cal-prev') { shiftCal(-1); render(); }
    else if (a === 'cal-next') { shiftCal(1); render(); }
    else if (a === 'cal-today') { ui.calDate = TODAY < START || TODAY > lastPlanDate() ? START : TODAY; render(); }
    else if (a === 'pick-date') { ui.calDate = t.dataset.date; if (ui.cal === 'month' || t.dataset.open) { ui.sheetFn = function () { openSheet(dayDetail(ui.calDate)); }; ui.sheetFn(); } render(); }
    else if (a === 'open-settings') { ui.sheetFn = sheetSettings; sheetSettings(); }
    else if (a === 'close-sheet') { ui.sheetFn = null; closeSheet(); render(); }
    else if (a === 'open-replan') openReplan(t.dataset.restart === '1');
    else if (a === 'toggle-rest') { var cur = day(t.dataset.date).rest; var o = {}; o[t.dataset.date] = { rest: !cur }; openReplan(false, o); }
    else if (a === 'rp-form') { ui.rp.formOpen = !ui.rp.formOpen; }
    else if (a === 'rp-recalc') { if (!readRpForm()) return; ui.rp.formOpen = true; computeReplan(ui.rp); sheetReplan(); }
    else if (a === 'rp-ext') { readRpForm(); ui.rp.cfg.deadline = t.dataset.date; computeReplan(ui.rp); sheetReplan(); }
    else if (a === 'rp-hours') { readRpForm(); ui.rp.cfg.maxHours = Number(t.dataset.h); computeReplan(ui.rp); sheetReplan(); }
    else if (a === 'rp-low') { ui.sheetFn = null; closeSheet(); go('lectures'); }
    else if (a === 'rp-ov-add') {
      var od = val('rp-ov-date'); readRpForm();
      if (!od || od < ui.rp.from || od > lastPlanDate()) { alert('오늘 이후, 계획 기간 안의 날짜를 골라 주세요.'); return; }
      ui.rp.ov[od] = { rest: true }; ui.rp.formOpen = true; computeReplan(ui.rp); sheetReplan();
    }
    else if (a === 'rp-ov-del') { readRpForm(); delete ui.rp.ov[t.dataset.date]; ui.rp.formOpen = true; computeReplan(ui.rp); sheetReplan(); }
    else if (a === 'rp-apply') { applyReplan(ui.rp); ui.sheetFn = null; closeSheet(); render(); }
    else if (a === 'timer-open') { openTimer(id || ''); }
    else if (a === 'tm-five') { startFive(); }
    else if (a === 'tm-focus') { ui.tcfg.focus = Number(t.dataset.m); sheetTimer(); }
    else if (a === 'tm-start') {
      ui.tcfg.lecId = val('tm-lec'); var cu = document.getElementById('tm-custom'); if (cu) ui.tcfg.custom = Math.max(1, Math.min(180, Number(cu.value) || 30));
      startTimer('study', ui.tcfg.lecId, ui.tcfg.focus || ui.tcfg.custom); ui.tmsg = ''; sheetTimer(); updateMini();
    }
    else if (a === 'tm-break') { startTimer('break', S.timer ? S.timer.lecId : ui.tcfg.lecId, Number(t.dataset.m)); ui.tmsg = ''; sheetTimer(); }
    else if (a === 'tm-pause') { pauseTimer(); sheetTimer(); }
    else if (a === 'tm-resume') { resumeTimer(); sheetTimer(); }
    else if (a === 'tm-stop') { var k0 = S.timer.kind, sec0 = stopTimer(); ui.tmsg = k0 === 'break' ? '휴식을 마쳤어요.' : fmt(sec0 / 60) + ' 기록했어요. 오늘도 한 걸음 나아갔어요.'; sheetTimer(); render(); updateMini(); }
    else if (a === 'tm-after') { timerAfter(t.dataset.k); render(); updateMini(); }
    else if (a === 'backup-download') backupDownload();
    else if (a === 'reset-all') resetAll();
    else if (a === 'minibar') sheetTimer();
    else if (a === 'start-study') { ui.sheetFn = sheetStart; sheetStart(); }
    else if (a === 'routine-edit') { ui.routineEdit = !ui.routineEdit; ui.keep = true; render(); }
    else if (a === 'routine-del') { var g = S.routine[Number(t.dataset.g)]; g.items = g.items.filter(function (i) { return i.id !== id; }); save(); ui.keep = true; render(); }
    else if (a === 'routine-add') { var gi = Number(t.dataset.g), inp = document.getElementById('radd' + gi), txt = inp && inp.value.trim(); if (!txt) return; S.routine[gi].items.push({ id: uid('r'), label: txt }); save(); ui.keep = true; render(); }
    else if (a === 'rate') { rate(t.dataset.key, t.dataset.lv); ui.keep = true; render(); }
    else if (a === 'add-note') { ui.sheetFn = function () { sheetNote(null); }; ui.sheetFn(); }
    else if (a === 'edit-note') { ui.sheetFn = function () { sheetNote(id); }; ui.sheetFn(); }
    else if (a === 'save-note') {
      var rec = { concept: val('n-concept').trim(), lecId: val('n-lec'), problem: val('n-problem').trim(), kind: val('n-kind'), reason: val('n-reason').trim(), level: val('n-level'), retryDate: val('n-date') || E.addDays(TODAY, 3) };
      if (!rec.concept && !rec.problem) { alert('개념명이나 대표 문제 중 하나는 적어 주세요.'); return; }
      if (id) { Object.assign(S.reviewNotes.find(function (x) { return x.id === id; }), rec); }
      else S.reviewNotes.push(Object.assign({ id: uid('n'), srcKey: null, retrySuccess: null, tries: [], created: TODAY }, rec));
      save(); ui.sheetFn = null; closeSheet(); render();
    }
    else if (a === 'del-note') { if (confirm('이 기록을 삭제할까요?')) { S.reviewNotes = S.reviewNotes.filter(function (x) { return x.id !== id; }); save(); ui.sheetFn = null; closeSheet(); render(); } }
    else if (a === 'retry') {
      var n = S.reviewNotes.find(function (x) { return x.id === id; }), ok = t.dataset.ok === '1';
      n.tries.push({ date: TODAY, ok: ok }); n.retrySuccess = ok;
      if (ok) n.level = '이해함'; else { n.level = '다시 공부 필요'; n.retryDate = E.addDays(TODAY, 2); }
      save(); ui.keep = true; render();
    }
    else if (a === 'edit-lec') { ui.sheetFn = function () { sheetLecture(id); }; ui.sheetFn(); }
    else if (a === 'save-lec') {
      var mn = Number(val('f-min')), sp = val('f-speed') ? Number(val('f-speed')) : null, sq = Number(val('f-seq')), name = val('f-name').trim(), st = val('f-status');
      if (!(mn > 0) || !name || (sp !== null && !(sp >= 1 && sp <= 3)) || isNaN(sq)) { alert('제목, 시간(1분 이상), 배속(1~3), 순서를 확인해 주세요.'); return; }
      var base = allBase().find(function (l) { return l.id === id; });
      var ed = { name: name, origMin: mn, seq: sq, status: st }; if (sp) ed.speed = sp;
      if (mn === base.origMin) delete ed.origMin; if (name === base.name) delete ed.name; if (sq === base.no) delete ed.seq;
      S.lectureEdits[id] = ed;
      if (st === 'completed' || st === 'review') { if (!S.completions[id]) S.completions[id] = TODAY; }
      else delete S.completions[id];
      if (st === (S.completions[id] ? 'completed' : base.status)) delete ed.status;
      save(); ui.sheetFn = null; closeSheet(); render();
    }
    else if (a === 'reset-lec') { delete S.lectureEdits[id]; var bs = allBase().find(function (l) { return l.id === id; }); if (bs.status !== 'completed') delete S.completions[id]; save(); ui.sheetFn = null; closeSheet(); render(); }
    else if (a === 'del-lec') { if (confirm('이 강의를 삭제할까요?')) { S.customLectures = S.customLectures.filter(function (l) { return l.id !== id; }); delete S.lectureEdits[id]; delete S.completions[id]; save(); ui.sheetFn = null; closeSheet(); render(); } }
    else if (a === 'add-lec') { ui.sheetFn = function () { sheetAddLecture(t.dataset.s); }; ui.sheetFn(); }
    else if (a === 'save-new-lec') {
      var sid = t.dataset.s, nm = val('a-name').trim(), m2 = Number(val('a-min'));
      if (!nm || !(m2 > 0)) { alert('제목과 영상 길이를 확인해 주세요.'); return; }
      var mx = Math.max.apply(null, allBase().filter(function (l) { return l.subject === sid; }).map(function (l) { return l.no; }));
      S.customLectures.push({ id: uid('CU-'), subject: sid, no: mx + 1, title: nm, tag: null, name: nm, origMin: m2, kind: val('a-kind'), status: 'pending', excludedReason: null, needsCheck: false, note: '', prereq: [], custom: true });
      save(); ui.sheetFn = null; closeSheet(); render();
    }
    else if (a === 'save-exams') {
      var next = S.settings.exams.map(function (x, i) { return { name: val('en' + i).trim() || x.name, date: val('ed' + i) || x.date }; });
      var earliest = next.map(function (x) { return x.date; }).sort()[0];
      if (earliest <= DEADLINE) { alert('시험일이 개념 완강 목표일(' + md(DEADLINE) + ')보다 빠를 수 없어요. 날짜를 확인해 주세요.'); return; }
      var horizonChanged = earliest !== examDates()[0];
      S.settings.exams = next;
      if (horizonChanged) {
        if (Object.keys(S.completions).length === 0) genPlan();
        else alert('시험일은 바뀌었어요. 이미 기록이 있어서 일정 기간 변경은 STEP D의 ‘일정 다시 만들기’에서 확인 후 반영돼요.');
      }
      save(); ui.sheetFn = null; closeSheet(); render();
    }
  });
  document.addEventListener('change', function (ev) {
    var t = ev.target; if (!t.dataset) return;
    if (t.id === 'tm-lec') { ui.tcfg.lecId = t.value; return; }
    if (t.id === 'import-file') { if (t.files && t.files[0]) backupImport(t.files[0]); return; }
    if (t.dataset.action === 'toggle-lec') {
      if (t.checked) S.completions[t.dataset.id] = TODAY; else delete S.completions[t.dataset.id];
      if (S.lectureEdits[t.dataset.id]) delete S.lectureEdits[t.dataset.id].status;
      save(); refresh();
    } else if (t.dataset.action === 'routine') {
      var dd = dailyOf(activeDay()); if (t.checked) dd.routine[t.dataset.k] = true; else delete dd.routine[t.dataset.k];
      save(); refresh();
    }
  });
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.dataset && t.dataset.action === 'note') { dailyOf(activeDay()).note = t.value; save(); }
    if (t.id === 'f-min' || t.id === 'f-speed') updatePreview();
  });
  document.getElementById('minibar').addEventListener('click', function () { sheetTimer(); });
  recoverTimer();
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', function () { if (S.timer && S.timer.runningSince) { S.timer.lastSeen = nowMs(); save(); } tick(); });
  window.addEventListener('pagehide', function () { if (S.timer && S.timer.runningSince) { S.timer.lastSeen = nowMs(); save(); } });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (h && h !== ui.tab) { ui.tab = h; render(); } });
  render(); updateMini();
  if (S.timer && S.timer.recovered) { ui.tmsg = ''; sheetTimer(); }
})();
