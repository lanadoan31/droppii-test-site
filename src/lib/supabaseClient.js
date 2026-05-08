import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ilkxvgruwyoucyolkcqu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsa3h2Z3J1d3lvdWN5b2xrY3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTgxNTUsImV4cCI6MjA5Mzc5NDE1NX0.l-aHiJwVsfTDRTYAv0Qv_j19Bh4TpghwaM-mTHW7XAo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
