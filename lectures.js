// 자동 생성 파일 (tools/build-lectures.js). 수정은 앱의 강의 관리 화면 또는 이 스크립트에서.
(function (g) {
  var D = {
 "meta": {
  "title": "김영편입 장황수학 2027 White 강의 데이터",
  "fetchedAt": "2026-11-23",
  "timezone": "Asia/Seoul",
  "source": "김영편입 공식 강좌 페이지 강의목차 표(강의명·시간)",
  "caveat": "시간(분)과 제목은 공식 페이지 표를 그대로 옮겼으나 수동 확인이 필요합니다. 강의 설명 원문이 없는 항목의 개념/문제풀이 구분은 제목 기준입니다.",
  "checksum": {
   "multiTotalMin": 3596,
   "linearApproxHours": 52
  }
 },
 "subjects": [
  {
   "id": "linear",
   "name": "선형대수",
   "course": "[편입수학의 기준] 2027 선형대수 : White",
   "chrCd": 49237,
   "url": "https://www.kimyoung.co.kr/math/math_chr_view.asp?chr_cd=49237",
   "officialCount": 35,
   "prereqNote": "미분학·적분학 이후 수강(사용자 진도 기준 34강까지 완료)"
  },
  {
   "id": "multi",
   "name": "다변수미적분",
   "course": "[편입수학의 기준] 2027 다변수미적분학 : White",
   "chrCd": 49794,
   "url": "https://www.kimyoung.co.kr/math/math_chr_view.asp?chr_cd=49794",
   "officialCount": 42,
   "prereqNote": "미분학·적분학 선수(복습 필요 상태)"
  },
  {
   "id": "eng",
   "name": "공학수학",
   "course": "[편입수학의 기준] 2027 공학수학 : White",
   "chrCd": 50178,
   "url": "https://www.kimyoung.co.kr/math/math_chr_view.asp?chr_cd=50178",
   "officialCount": 24,
   "prereqNote": "미분학·적분학, 선형대수(고유치·고유벡터) 선수"
  }
 ],
 "reviewOnlySubjects": [
  {
   "id": "diff",
   "name": "미분학",
   "status": "review",
   "note": "기본 강의 수강 완료, 복습 필요 — 강의 목록은 조사 대상 아님"
  },
  {
   "id": "integral",
   "name": "적분학",
   "status": "review",
   "note": "기본 강의 수강 완료, 복습 필요 — 강의 목록은 조사 대상 아님"
  }
 ],
 "lectures": [
  {
   "id": "LA-00",
   "subject": "linear",
   "no": 0,
   "title": "선형대수 OT",
   "tag": null,
   "name": "선형대수 OT",
   "origMin": 10,
   "kind": "ot",
   "status": "excluded",
   "excludedReason": "OT(오리엔테이션)은 개념 강의가 아니며 1강부터 시작하는 규칙을 따름",
   "needsCheck": false,
   "note": "",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-01",
   "subject": "linear",
   "no": 1,
   "title": "[1-1] 벡터의 정의 및 내적",
   "tag": "1-1",
   "name": "벡터의 정의 및 내적",
   "origMin": 78,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-02",
   "subject": "linear",
   "no": 2,
   "title": "[1-2] 벡터의 외적",
   "tag": "1-2",
   "name": "벡터의 외적",
   "origMin": 54,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-01"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-03",
   "subject": "linear",
   "no": 3,
   "title": "[2-1] 외적의 성질 및 직선, 평면의 방정식",
   "tag": "2-1",
   "name": "외적의 성질 및 직선, 평면의 방정식",
   "origMin": 79,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-02"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-04",
   "subject": "linear",
   "no": 4,
   "title": "[2-2] 공간상의 거리 및 사면체",
   "tag": "2-2",
   "name": "공간상의 거리 및 사면체",
   "origMin": 69,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-03"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-05",
   "subject": "linear",
   "no": 5,
   "title": "[3-1] 1단원 유형별 문제풀이 (1~12번)",
   "tag": "3-1",
   "name": "1단원 유형별 문제풀이 (1~12번)",
   "origMin": 86,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "LA-06",
   "subject": "linear",
   "no": 6,
   "title": "[3-2] 1단원 유형별 문제풀이 (13~15번)",
   "tag": "3-2",
   "name": "1단원 유형별 문제풀이 (13~15번)",
   "origMin": 68,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "LA-07",
   "subject": "linear",
   "no": 7,
   "title": "[4-1] 1단원 단단 및 행렬의 정의",
   "tag": "4-1",
   "name": "1단원 단단 및 행렬의 정의",
   "origMin": 72,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-04"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-08",
   "subject": "linear",
   "no": 8,
   "title": "[4-2] 행렬의 연산",
   "tag": "4-2",
   "name": "행렬의 연산",
   "origMin": 80,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-07"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-09",
   "subject": "linear",
   "no": 9,
   "title": "[5-1] 행렬의 종류 및 행렬식 (1)",
   "tag": "5-1",
   "name": "행렬의 종류 및 행렬식 (1)",
   "origMin": 79,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-08"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-10",
   "subject": "linear",
   "no": 10,
   "title": "[5-2] 행렬식 (2)",
   "tag": "5-2",
   "name": "행렬식 (2)",
   "origMin": 74,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-09"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-11",
   "subject": "linear",
   "no": 11,
   "title": "[6-1] 랭크 및 활용",
   "tag": "6-1",
   "name": "랭크 및 활용",
   "origMin": 111,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-10"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-12",
   "subject": "linear",
   "no": 12,
   "title": "[6-2] 역행렬 정의 및 성질",
   "tag": "6-2",
   "name": "역행렬 정의 및 성질",
   "origMin": 57,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-11"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-13",
   "subject": "linear",
   "no": 13,
   "title": "[7-1] 역행렬의 성질 및 LU 분해",
   "tag": "7-1",
   "name": "역행렬의 성질 및 LU 분해",
   "origMin": 77,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-12"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-14",
   "subject": "linear",
   "no": 14,
   "title": "[7-2] 크래머 법칙 및 최소제곱해",
   "tag": "7-2",
   "name": "크래머 법칙 및 최소제곱해",
   "origMin": 101,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-13"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-15",
   "subject": "linear",
   "no": 15,
   "title": "[8-1] 2단원 유형별 플러스 (1~12번)",
   "tag": "8-1",
   "name": "2단원 유형별 플러스 (1~12번)",
   "origMin": 97,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "LA-16",
   "subject": "linear",
   "no": 16,
   "title": "[8-2] 2단원 유형별 플러스 (13~15번) 및 단단 / 벡터공간 및 부분공간",
   "tag": "8-2",
   "name": "2단원 유형별 플러스 (13~15번) 및 단단 / 벡터공간 및 부분공간",
   "origMin": 97,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-14"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-17",
   "subject": "linear",
   "no": 17,
   "title": "[9-1] 일차독립과 종속 / 기저",
   "tag": "9-1",
   "name": "일차독립과 종속 / 기저",
   "origMin": 110,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-16"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-18",
   "subject": "linear",
   "no": 18,
   "title": "[9-2] 벡터공간 및 부분공간의 차원",
   "tag": "9-2",
   "name": "벡터공간 및 부분공간의 차원",
   "origMin": 79,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-17"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-19",
   "subject": "linear",
   "no": 19,
   "title": "[10-1] 내적공간 및 행렬의 기본공간",
   "tag": "10-1",
   "name": "내적공간 및 행렬의 기본공간",
   "origMin": 90,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-18"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-20",
   "subject": "linear",
   "no": 20,
   "title": "[10-2] 영공간 및 직교기저",
   "tag": "10-2",
   "name": "영공간 및 직교기저",
   "origMin": 101,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-19"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-21",
   "subject": "linear",
   "no": 21,
   "title": "[11-1] 직교기저의 활용",
   "tag": "11-1",
   "name": "직교기저의 활용",
   "origMin": 95,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-20"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-22",
   "subject": "linear",
   "no": 22,
   "title": "[11-2] 선형변환과 표준행렬",
   "tag": "11-2",
   "name": "선형변환과 표준행렬",
   "origMin": 86,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-21"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-23",
   "subject": "linear",
   "no": 23,
   "title": "[12-1] 단사, 전사 함수 및 유형별 3단원 플러스",
   "tag": "12-1",
   "name": "단사, 전사 함수 및 유형별 3단원 플러스",
   "origMin": 114,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-22"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-24",
   "subject": "linear",
   "no": 24,
   "title": "[12-2] 단단 및 고유치, 고유벡터",
   "tag": "12-2",
   "name": "단단 및 고유치, 고유벡터",
   "origMin": 79,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-23"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-25",
   "subject": "linear",
   "no": 25,
   "title": "[13-1] 고유치, 고유벡터의 성질 및 C-H 정리",
   "tag": "13-1",
   "name": "고유치, 고유벡터의 성질 및 C-H 정리",
   "origMin": 109,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-24"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-26",
   "subject": "linear",
   "no": 26,
   "title": "[13-2] 닮은 행렬 및 대각화",
   "tag": "13-2",
   "name": "닮은 행렬 및 대각화",
   "origMin": 73,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-25"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-27",
   "subject": "linear",
   "no": 27,
   "title": "[14-1] 조르단 표준형 및 직교대각화",
   "tag": "14-1",
   "name": "조르단 표준형 및 직교대각화",
   "origMin": 85,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-26"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-28",
   "subject": "linear",
   "no": 28,
   "title": "[14-2] 회전 행렬 및 주축 정리",
   "tag": "14-2",
   "name": "회전 행렬 및 주축 정리",
   "origMin": 116,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-27"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-29",
   "subject": "linear",
   "no": 29,
   "title": "[15-1] 최대 및 최소 / 양정치 행렬",
   "tag": "15-1",
   "name": "최대 및 최소 / 양정치 행렬",
   "origMin": 102,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-28"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-30",
   "subject": "linear",
   "no": 30,
   "title": "[15-2] 4단원 유형별 플러스",
   "tag": "15-2",
   "name": "4단원 유형별 플러스",
   "origMin": 84,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "LA-31",
   "subject": "linear",
   "no": 31,
   "title": "[16-1] 4단원 단단 및 표현행렬",
   "tag": "16-1",
   "name": "4단원 단단 및 표현행렬",
   "origMin": 87,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-29"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-32",
   "subject": "linear",
   "no": 32,
   "title": "[16-2] 표현행렬 및 기저변환행렬",
   "tag": "16-2",
   "name": "표현행렬 및 기저변환행렬",
   "origMin": 110,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-31"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-33",
   "subject": "linear",
   "no": 33,
   "title": "[17-1] 사영변환",
   "tag": "17-1",
   "name": "사영변환",
   "origMin": 121,
   "kind": "concept",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-32"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "LA-34",
   "subject": "linear",
   "no": 34,
   "title": "[17-2] 반사변환 및 5단원 유형별 플러스",
   "tag": "17-2",
   "name": "반사변환 및 5단원 유형별 플러스",
   "origMin": 114,
   "kind": "mixed",
   "status": "completed",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다. 사용자 진도 기준(마지막 1강만 남음) 수강 완료 처리.",
   "prereq": [
    "LA-33"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "LA-35",
   "subject": "linear",
   "no": 35,
   "title": "[18-1] 복소행렬, 특이값 분해, QR분해 ▶종강",
   "tag": "18-1",
   "name": "복소행렬, 특이값 분해, QR분해",
   "origMin": 70,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "LA-34"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-00",
   "subject": "multi",
   "no": 0,
   "title": "다변수 미적분 OT",
   "tag": null,
   "name": "다변수 미적분 OT",
   "origMin": 10,
   "kind": "ot",
   "status": "excluded",
   "excludedReason": "OT(오리엔테이션)은 개념 강의가 아니며 1강부터 시작하는 규칙을 따름",
   "needsCheck": false,
   "note": "",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-01",
   "subject": "multi",
   "no": 1,
   "title": "[1-1] 이변수 함수의 극한 및 연속",
   "tag": "1-1",
   "name": "이변수 함수의 극한 및 연속",
   "origMin": 85,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-02",
   "subject": "multi",
   "no": 2,
   "title": "[1-2] 편도함수의 정의",
   "tag": "1-2",
   "name": "편도함수의 정의",
   "origMin": 91,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-01"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-03",
   "subject": "multi",
   "no": 3,
   "title": "[2-1] 고계 편도함수 및 동차 함수",
   "tag": "2-1",
   "name": "고계 편도함수 및 동차 함수",
   "origMin": 95,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-02"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-04",
   "subject": "multi",
   "no": 4,
   "title": "[2-2] 파동 방정식 및 전미분",
   "tag": "2-2",
   "name": "파동 방정식 및 전미분",
   "origMin": 78,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-03"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-05",
   "subject": "multi",
   "no": 5,
   "title": "[3-1] 합성함수 및 음함수 미분법",
   "tag": "3-1",
   "name": "합성함수 및 음함수 미분법",
   "origMin": 62,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-04"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-06",
   "subject": "multi",
   "no": 6,
   "title": "[3-2] 경도 및 방향도함수",
   "tag": "3-2",
   "name": "경도 및 방향도함수",
   "origMin": 98,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-05"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-07",
   "subject": "multi",
   "no": 7,
   "title": "[4-1] T급수 및 M급수 / 1단원 유형별 플러스",
   "tag": "4-1",
   "name": "T급수 및 M급수 / 1단원 유형별 플러스",
   "origMin": 88,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-06"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-08",
   "subject": "multi",
   "no": 8,
   "title": "[4-2] 1단원 유형별 플러스 및 단단",
   "tag": "4-2",
   "name": "1단원 유형별 플러스 및 단단",
   "origMin": 86,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-09",
   "subject": "multi",
   "no": 9,
   "title": "[5-1] 벡터함수의 공간도형의 방정식 및 경도",
   "tag": "5-1",
   "name": "벡터함수의 공간도형의 방정식 및 경도",
   "origMin": 84,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-07"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-10",
   "subject": "multi",
   "no": 10,
   "title": "[5-2] 공간도형의 방정식 및 곡률",
   "tag": "5-2",
   "name": "공간도형의 방정식 및 곡률",
   "origMin": 81,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-09"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-11",
   "subject": "multi",
   "no": 11,
   "title": "[6-1] 곡률원 및 T, N, B",
   "tag": "6-1",
   "name": "곡률원 및 T, N, B",
   "origMin": 99,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-10"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-12",
   "subject": "multi",
   "no": 12,
   "title": "[6-2] 접촉평면 및 열률 / 2단원 유형별 플러스",
   "tag": "6-2",
   "name": "접촉평면 및 열률 / 2단원 유형별 플러스",
   "origMin": 63,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-11"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-13",
   "subject": "multi",
   "no": 13,
   "title": "[7-1] 2단원 유형별 플러스 및 단단",
   "tag": "7-1",
   "name": "2단원 유형별 플러스 및 단단",
   "origMin": 80,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-14",
   "subject": "multi",
   "no": 14,
   "title": "[7-2] 극대, 극소 및 최대, 최소",
   "tag": "7-2",
   "name": "극대, 극소 및 최대, 최소",
   "origMin": 76,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-12"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-15",
   "subject": "multi",
   "no": 15,
   "title": "[8-1] 이변수함수의 최대 및 최소 / 라그랑주",
   "tag": "8-1",
   "name": "이변수함수의 최대 및 최소 / 라그랑주",
   "origMin": 90,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-14"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-16",
   "subject": "multi",
   "no": 16,
   "title": "[8-2] 멀티 라그랑주 및 3단원 유형별 플러스",
   "tag": "8-2",
   "name": "멀티 라그랑주 및 3단원 유형별 플러스",
   "origMin": 85,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-15"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-17",
   "subject": "multi",
   "no": 17,
   "title": "[9-1] 3단원 유형별 플러스 및 단단",
   "tag": "9-1",
   "name": "3단원 유형별 플러스 및 단단",
   "origMin": 101,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-18",
   "subject": "multi",
   "no": 18,
   "title": "[9-2] 이차곡면",
   "tag": "9-2",
   "name": "이차곡면",
   "origMin": 101,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-16"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-19",
   "subject": "multi",
   "no": 19,
   "title": "[9-3] 이중적분",
   "tag": "9-3",
   "name": "이중적분",
   "origMin": 57,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-18"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-20",
   "subject": "multi",
   "no": 20,
   "title": "[10-1] 적분순서 변경 및 변수변환 (1)",
   "tag": "10-1",
   "name": "적분순서 변경 및 변수변환 (1)",
   "origMin": 95,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-19"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-21",
   "subject": "multi",
   "no": 21,
   "title": "[10-2] 적분순서 변경 및 변수변환 (2)",
   "tag": "10-2",
   "name": "적분순서 변경 및 변수변환 (2)",
   "origMin": 71,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-20"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-22",
   "subject": "multi",
   "no": 22,
   "title": "[11-1] 극좌표를 이용한 이중적분",
   "tag": "11-1",
   "name": "극좌표를 이용한 이중적분",
   "origMin": 86,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-21"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-23",
   "subject": "multi",
   "no": 23,
   "title": "[11-2] 이중적분 및 4단원 유형별 플러스 (1)",
   "tag": "11-2",
   "name": "이중적분 및 4단원 유형별 플러스 (1)",
   "origMin": 48,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-22"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-24",
   "subject": "multi",
   "no": 24,
   "title": "[12-1] 4단원 유형별 플러스 (2)",
   "tag": "12-1",
   "name": "4단원 유형별 플러스 (2)",
   "origMin": 90,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-25",
   "subject": "multi",
   "no": 25,
   "title": "[12-2] 4단원 유형별 플러스 (3) 및 단단",
   "tag": "12-2",
   "name": "4단원 유형별 플러스 (3) 및 단단",
   "origMin": 81,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-26",
   "subject": "multi",
   "no": 26,
   "title": "[13-1] 4단원별 단단",
   "tag": "13-1",
   "name": "4단원별 단단",
   "origMin": 76,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-27",
   "subject": "multi",
   "no": 27,
   "title": "[13-2] 이중적분을 이용한 부피",
   "tag": "13-2",
   "name": "이중적분을 이용한 부피",
   "origMin": 77,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-23"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-28",
   "subject": "multi",
   "no": 28,
   "title": "[14-1] 이중적분을 이용한 부피 및 곡면적",
   "tag": "14-1",
   "name": "이중적분을 이용한 부피 및 곡면적",
   "origMin": 102,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-27"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-29",
   "subject": "multi",
   "no": 29,
   "title": "[14-2] 곡면적 및 삼중적분",
   "tag": "14-2",
   "name": "곡면적 및 삼중적분",
   "origMin": 70,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-28"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-30",
   "subject": "multi",
   "no": 30,
   "title": "[15-1] 원주좌표계 및 구면좌표계",
   "tag": "15-1",
   "name": "원주좌표계 및 구면좌표계",
   "origMin": 90,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-29"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-31",
   "subject": "multi",
   "no": 31,
   "title": "[15-2] 구면좌표계 및 중심좌표",
   "tag": "15-2",
   "name": "구면좌표계 및 중심좌표",
   "origMin": 88,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-30"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-32",
   "subject": "multi",
   "no": 32,
   "title": "[16-1] 중심좌표 및 5단원 유형별 플러스",
   "tag": "16-1",
   "name": "중심좌표 및 5단원 유형별 플러스",
   "origMin": 113,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-31"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-33",
   "subject": "multi",
   "no": 33,
   "title": "[16-2] 5단원 유형별 플러스",
   "tag": "16-2",
   "name": "5단원 유형별 플러스",
   "origMin": 107,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-34",
   "subject": "multi",
   "no": 34,
   "title": "[16-3] 토러스 및 5단원 단단",
   "tag": "16-3",
   "name": "토러스 및 5단원 단단",
   "origMin": 85,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "MV-32"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "MV-35",
   "subject": "multi",
   "no": 35,
   "title": "[17-1] 벡터함수",
   "tag": "17-1",
   "name": "벡터함수",
   "origMin": 72,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-34"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-36",
   "subject": "multi",
   "no": 36,
   "title": "[17-2] 스칼라 함수의 선적분 및 벡터함수의 선적분",
   "tag": "17-2",
   "name": "스칼라 함수의 선적분 및 벡터함수의 선적분",
   "origMin": 92,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-35"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-37",
   "subject": "multi",
   "no": 37,
   "title": "[18-1] 벡터함수의 선적분",
   "tag": "18-1",
   "name": "벡터함수의 선적분",
   "origMin": 108,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-36"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-38",
   "subject": "multi",
   "no": 38,
   "title": "[18-2] 특이한 벡터장 및 스칼라 선적분",
   "tag": "18-2",
   "name": "특이한 벡터장 및 스칼라 선적분",
   "origMin": 61,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-37"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-39",
   "subject": "multi",
   "no": 39,
   "title": "[19-1] 벡터함수의 면적분 (유량)",
   "tag": "19-1",
   "name": "벡터함수의 면적분 (유량)",
   "origMin": 85,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-38"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-40",
   "subject": "multi",
   "no": 40,
   "title": "[19-2] 스톡스 정리",
   "tag": "19-2",
   "name": "스톡스 정리",
   "origMin": 101,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "MV-39"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "MV-41",
   "subject": "multi",
   "no": 41,
   "title": "[20-1] 6단원 유형별 플러스",
   "tag": "20-1",
   "name": "6단원 유형별 플러스",
   "origMin": 97,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "MV-42",
   "subject": "multi",
   "no": 42,
   "title": "[20-2] 6단원 유형별 플러스 및 단단 ▶종강",
   "tag": "20-2",
   "name": "6단원 유형별 플러스 및 단단",
   "origMin": 91,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "EM-01",
   "subject": "eng",
   "no": 1,
   "title": "[1-1] 변수분리 및 동차 미분방정식",
   "tag": "1-1",
   "name": "변수분리 및 동차 미분방정식",
   "origMin": 96,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-02",
   "subject": "eng",
   "no": 2,
   "title": "[1-2] 완전형 및 적분인수, 1계 선형 미방",
   "tag": "1-2",
   "name": "완전형 및 적분인수, 1계 선형 미방",
   "origMin": 58,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-01"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-03",
   "subject": "eng",
   "no": 3,
   "title": "[2-1] 1계 선형 및 베르누이 미방",
   "tag": "2-1",
   "name": "1계 선형 및 베르누이 미방",
   "origMin": 87,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-02"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-04",
   "subject": "eng",
   "no": 4,
   "title": "[2-2] 직교사영 및 2계 미방",
   "tag": "2-2",
   "name": "직교사영 및 2계 미방",
   "origMin": 95,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-03"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-05",
   "subject": "eng",
   "no": 5,
   "title": "[3-1] 상수계수 및 코시 오일러 미방",
   "tag": "3-1",
   "name": "상수계수 및 코시 오일러 미방",
   "origMin": 95,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-04"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-06",
   "subject": "eng",
   "no": 6,
   "title": "[3-2] 비제차 미방 및 역연산자 (1)",
   "tag": "3-2",
   "name": "비제차 미방 및 역연산자 (1)",
   "origMin": 65,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-05"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-07",
   "subject": "eng",
   "no": 7,
   "title": "[4-1] 역연산자 (2)",
   "tag": "4-1",
   "name": "역연산자 (2)",
   "origMin": 76,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-06"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-08",
   "subject": "eng",
   "no": 8,
   "title": "[4-2] 미정계수법 및 론스키안 해법",
   "tag": "4-2",
   "name": "미정계수법 및 론스키안 해법",
   "origMin": 72,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-07"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-09",
   "subject": "eng",
   "no": 9,
   "title": "[5-1] 용수철 및 전기회로 미방 / 급수해법",
   "tag": "5-1",
   "name": "용수철 및 전기회로 미방 / 급수해법",
   "origMin": 85,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-08"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-10",
   "subject": "eng",
   "no": 10,
   "title": "[5-2] 제차 선형 연립 미방",
   "tag": "5-2",
   "name": "제차 선형 연립 미방",
   "origMin": 79,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "선수: 선형대수 24강(고유치·고유벡터) — 강의 내용 기준 추정, 공식 선수관계는 아님.",
   "prereq": [
    "EM-09",
    "LA-24"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-11",
   "subject": "eng",
   "no": 11,
   "title": "[6-1] 연립 미분방정식 및 해곡선",
   "tag": "6-1",
   "name": "연립 미분방정식 및 해곡선",
   "origMin": 77,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-10"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-12",
   "subject": "eng",
   "no": 12,
   "title": "[6-2] 1단원 유형별 플러스 (1)",
   "tag": "6-2",
   "name": "1단원 유형별 플러스 (1)",
   "origMin": 103,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "EM-13",
   "subject": "eng",
   "no": 13,
   "title": "[7-1] 1단원 유형별 플러스 (2)",
   "tag": "7-1",
   "name": "1단원 유형별 플러스 (2)",
   "origMin": 103,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "EM-14",
   "subject": "eng",
   "no": 14,
   "title": "[7-2] 1단원 유형별 플러스 (3) 및 단단",
   "tag": "7-2",
   "name": "1단원 유형별 플러스 (3) 및 단단",
   "origMin": 88,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "EM-15",
   "subject": "eng",
   "no": 15,
   "title": "[8-1] 1단원 단단",
   "tag": "8-1",
   "name": "1단원 단단",
   "origMin": 78,
   "kind": "problem_only",
   "status": "excluded",
   "excludedReason": "제목이 문제풀이(유형별/단단)로만 구성됨 — 제목 기준 판단",
   "needsCheck": true,
   "note": "공식 페이지에는 제목·시간만 있어 새 개념 포함 여부는 미확인입니다. 필요하면 강의 관리에서 상태를 바꿔 포함하세요.",
   "prereq": [],
   "verification": {
    "time": "official",
    "kind": "title-inferred"
   }
  },
  {
   "id": "EM-16",
   "subject": "eng",
   "no": 16,
   "title": "[8-2] 라플라스 변환 및 1변위",
   "tag": "8-2",
   "name": "라플라스 변환 및 1변위",
   "origMin": 83,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-11"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-17",
   "subject": "eng",
   "no": 17,
   "title": "[9-1] 라플라스의 기타 변환 공식",
   "tag": "9-1",
   "name": "라플라스의 기타 변환 공식",
   "origMin": 85,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-16"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-18",
   "subject": "eng",
   "no": 18,
   "title": "[9-2] 미분 방정식과 라플라스 변환",
   "tag": "9-2",
   "name": "미분 방정식과 라플라스 변환",
   "origMin": 67,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-17"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-19",
   "subject": "eng",
   "no": 19,
   "title": "[10-1] 2변위 공식 및 주기함수",
   "tag": "10-1",
   "name": "2변위 공식 및 주기함수",
   "origMin": 100,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-18"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-20",
   "subject": "eng",
   "no": 20,
   "title": "[10-2] 충격파 함수 및 합성곱",
   "tag": "10-2",
   "name": "충격파 함수 및 합성곱",
   "origMin": 63,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-19"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  },
  {
   "id": "EM-21",
   "subject": "eng",
   "no": 21,
   "title": "[11-1] 라플라스 변환의 활용 및 2단원 유형별 플러스",
   "tag": "11-1",
   "name": "라플라스 변환의 활용 및 2단원 유형별 플러스",
   "origMin": 83,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "EM-20"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "EM-22",
   "subject": "eng",
   "no": 22,
   "title": "[11-2] 2단원 유형별 플러스 및 단단 / 푸리에 급수",
   "tag": "11-2",
   "name": "2단원 유형별 플러스 및 단단 / 푸리에 급수",
   "origMin": 74,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "EM-21"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "EM-23",
   "subject": "eng",
   "no": 23,
   "title": "[12-1] 푸리에 급수, 적분, 변환 / 3단원 유형별 플러스",
   "tag": "12-1",
   "name": "푸리에 급수, 적분, 변환 / 3단원 유형별 플러스",
   "origMin": 117,
   "kind": "mixed",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "개념 구간과 문제풀이 구간이 함께 있는 강의라 제외하지 않았습니다.",
   "prereq": [
    "EM-22"
   ],
   "verification": {
    "time": "official",
    "kind": "title-mixed"
   }
  },
  {
   "id": "EM-24",
   "subject": "eng",
   "no": 24,
   "title": "[12-2] 베셀 및 르장드르 방정식 ▶종강",
   "tag": "12-2",
   "name": "베셀 및 르장드르 방정식",
   "origMin": 57,
   "kind": "concept",
   "status": "pending",
   "excludedReason": null,
   "needsCheck": false,
   "note": "",
   "prereq": [
    "EM-23"
   ],
   "verification": {
    "time": "official",
    "kind": "title-clear"
   }
  }
 ]
};
  if (typeof module === 'object' && module.exports) module.exports = D; else g.LECTURE_DATA = D;
})(typeof self !== 'undefined' ? self : this);
