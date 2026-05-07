// Admin mock data — Vietnamese, Droppii Business branch.
// In production, replace with API calls (TanStack Query / tRPC).

export const CURRENT_ADMIN = {
  name: "Trần Hoàng Quân",
  email: "quan.tran@droppii.vn",
  role: "Quản trị viên",
  initials: "QT",
};

export const TESTS = [
  {
    id: "DRP-AI-2026",
    name: "Kiến thức AI cho Nhà bán hàng — 2026",
    status: "Đang mở",
    type: "Định kỳ",
    questions: 20,
    duration_min: 30,
    pass_score: 70,
    taken: 38421,
    pass_rate: 74.2,
    updated: "2 ngày trước",
  },
  {
    id: "DRP-TPCN-Q1",
    name: "Tư vấn TPCN — Tình huống lâm sàng",
    status: "Đang mở",
    type: "Định kỳ",
    questions: 15,
    duration_min: 25,
    pass_score: 75,
    taken: 12903,
    pass_rate: 68.5,
    updated: "1 tuần trước",
  },
  {
    id: "DRP-PROD-26",
    name: "Kiến thức sản phẩm Q2/2026",
    status: "Đang mở",
    type: "Bắt buộc",
    questions: 25,
    duration_min: 35,
    pass_score: 70,
    taken: 8217,
    pass_rate: 82.1,
    updated: "3 ngày trước",
  },
  {
    id: "DRP-ETHIC-25",
    name: "Đạo đức nghề nghiệp — 2025",
    status: "Đã lưu trữ",
    type: "Định kỳ",
    questions: 18,
    duration_min: 25,
    pass_score: 70,
    taken: 49120,
    pass_rate: 91.4,
    updated: "8 tháng trước",
  },
  {
    id: "DRP-NEW-26",
    name: "Onboarding — Người bán mới T05",
    status: "Bản nháp",
    type: "Bắt buộc",
    questions: 12,
    duration_min: 20,
    pass_score: 60,
    taken: 0,
    pass_rate: 0,
    updated: "Hôm nay",
  },
];

export const KPIS = {
  sellers_total: 52481,
  sellers_certified: 38927,
  pass_rate: 74.2,
  pass_rate_delta: +3.8,
  avg_score: 81.6,
  avg_score_delta: +1.2,
  avg_time_min: 24.7,
  avg_time_delta: -1.4,
  drop_off_rate: 8.3,
  drop_off_delta: -1.1,
};

export const RECENT_ACTIVITY = [
  { who: "Nguyễn Thị Mai Anh", id: "DRP-58294", action: "đậu",      test: "DRP-AI-2026",   score: 88,   when: "2 phút trước",  region: "Hà Nội"  },
  { who: "Trần Văn Hùng",      id: "DRP-41205", action: "đậu",      test: "DRP-AI-2026",   score: 92,   when: "5 phút trước",  region: "TP.HCM"  },
  { who: "Lê Thị Phương",      id: "DRP-12089", action: "rớt",      test: "DRP-TPCN-Q1",   score: 64,   when: "8 phút trước",  region: "Đà Nẵng" },
  { who: "Phạm Quốc Bảo",      id: "DRP-77103", action: "đang làm", test: "DRP-AI-2026",   score: null, when: "12 phút trước", region: "Cần Thơ" },
  { who: "Hoàng Minh Tú",      id: "DRP-32480", action: "đậu",      test: "DRP-PROD-26",   score: 84,   when: "18 phút trước", region: "Hải Phòng"},
];

export const QUESTION_BANK = [
  { id: "Q-0142", topic: "Lâm sàng",   type: "Tình huống",  difficulty: "Khó", correct_rate: 62.1, used_in: 3 },
  { id: "Q-0098", topic: "Đạo đức",    type: "Multi-select",difficulty: "Vừa", correct_rate: 71.4, used_in: 5 },
  { id: "Q-0203", topic: "Cơ bản AI",  type: "Single",      difficulty: "Dễ",  correct_rate: 88.9, used_in: 7 },
  { id: "Q-0311", topic: "Sản phẩm",   type: "Single",      difficulty: "Vừa", correct_rate: 74.0, used_in: 4 },
  { id: "Q-0455", topic: "Tư vấn",     type: "Tình huống",  difficulty: "Khó", correct_rate: 58.2, used_in: 2 },
  { id: "Q-0512", topic: "Đạo đức",    type: "Single",      difficulty: "Dễ",  correct_rate: 92.1, used_in: 6 },
  { id: "Q-0588", topic: "Lâm sàng",   type: "Short text",  difficulty: "Khó", correct_rate: 45.3, used_in: 1 },
  { id: "Q-0621", topic: "Cơ bản AI",  type: "Multi-select",difficulty: "Vừa", correct_rate: 67.8, used_in: 4 },
];
