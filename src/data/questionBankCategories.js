/**
 * Canonical question-bank categories (Question Bank filter + create/edit form).
 * Single source of truth — import from here only; do not duplicate the list.
 */
export const QUESTION_CATEGORIES = [
  'Lý Thuyết Chuyên Môn Cơ Bản',
  'Lý Thuyết Về Chatbot Ai',
  'Tình Huống',
  'Ứng Dụng Chatbot Vào Tư Vấn',
];

export const DEFAULT_QUESTION_CATEGORY = QUESTION_CATEGORIES[0];

/** Legacy English labels from earlier seeds / DB → new canonical category (UI + filters). */
const LEGACY_QUESTION_CATEGORY_MAP = {
  General: 'Lý Thuyết Chuyên Môn Cơ Bản',
  Onboarding: 'Lý Thuyết Chuyên Môn Cơ Bản',
  Compliance: 'Lý Thuyết Chuyên Môn Cơ Bản',
  Marketing: 'Lý Thuyết Về Chatbot Ai',
  Service: 'Tình Huống',
  Operations: 'Ứng Dụng Chatbot Vào Tư Vấn',
  Listings: 'Ứng Dụng Chatbot Vào Tư Vấn',
};

/**
 * Maps stored category to one of QUESTION_CATEGORIES for display, filters, and selects.
 * Unknown / empty values fall back to DEFAULT_QUESTION_CATEGORY (no throw, no data loss).
 */
export function canonicalQuestionCategory(stored) {
  const raw = (stored ?? '').trim();
  if (!raw) return DEFAULT_QUESTION_CATEGORY;
  if (QUESTION_CATEGORIES.includes(raw)) return raw;
  const direct = LEGACY_QUESTION_CATEGORY_MAP[raw];
  if (direct) return direct;
  const lower = raw.toLowerCase();
  for (const [legacy, mapped] of Object.entries(LEGACY_QUESTION_CATEGORY_MAP)) {
    if (legacy.toLowerCase() === lower) return mapped;
  }
  return DEFAULT_QUESTION_CATEGORY;
}
