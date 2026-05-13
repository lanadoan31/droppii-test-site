-- Optional: map legacy question-bank `category` values on `public.questions` to the new Vietnamese labels.
-- Safe: UPDATE only; no deletes; no table recreation.
-- Run after deploying app code that understands the new categories.
-- Inspect first: SELECT DISTINCT category FROM public.questions ORDER BY 1;

-- Lý Thuyết Chuyên Môn Cơ Bản
update public.questions
set category = 'Lý Thuyết Chuyên Môn Cơ Bản'
where category in ('General', 'Onboarding', 'Compliance')
   or lower(trim(category)) in ('general', 'onboarding', 'compliance');

-- Lý Thuyết Về Chatbot Ai
update public.questions
set category = 'Lý Thuyết Về Chatbot Ai'
where category in ('Marketing')
   or lower(trim(category)) = 'marketing';

-- Tình Huống
update public.questions
set category = 'Tình Huống'
where category in ('Service')
   or lower(trim(category)) = 'service';

-- Ứng Dụng Chatbot Vào Tư Vấn
update public.questions
set category = 'Ứng Dụng Chatbot Vào Tư Vấn'
where category in ('Operations', 'Listings')
   or lower(trim(category)) in ('operations', 'listings');
