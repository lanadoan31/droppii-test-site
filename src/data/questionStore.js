import { supabase } from '../lib/supabaseClient';

function rowToQuestion(row) {
  return {
    id:       row.id,
    text:     row.content || '',
    type:     row.type || 'multiple-choice',
    options:  Array.isArray(row.options) ? row.options : [],
    correct:  Array.isArray(row.correct_answer) ? row.correct_answer : [],
    category: row.category || 'General',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function questionToRow(q) {
  return {
    content:        q.text || '',
    type:           q.type || 'multiple-choice',
    options:        q.type === 'short-answer' ? null : (q.options || []),
    correct_answer: q.correct || [],
    category:       q.category || 'General',
  };
}

export async function getAllQuestions() {
  console.log('[Supabase] fetching questions');
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('[Supabase] getAllQuestions error:', error); return []; }
  return (data || []).map(rowToQuestion);
}

export async function createQuestion(question) {
  console.log('[Supabase] saving question:', question.text?.slice(0, 60));
  const { data, error } = await supabase
    .from('questions')
    .insert(questionToRow(question))
    .select()
    .single();
  if (error) { console.error('[Supabase] createQuestion error:', error); throw error; }
  return rowToQuestion(data);
}

export async function updateQuestion(id, question) {
  console.log('[Supabase] saving question:', id);
  const { data, error } = await supabase
    .from('questions')
    .update(questionToRow(question))
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('[Supabase] updateQuestion error:', error); throw error; }
  return rowToQuestion(data);
}

export async function deleteQuestion(id) {
  console.log('[Supabase] deleting question:', id);
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);
  if (error) { console.error('[Supabase] deleteQuestion error:', error); throw error; }
}
