import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jyjoyuhnqokxdxybycuk.supabase.co';
const supabaseKey = 'sb_publishable_q63s1Z-lrBFTphDxme31xw_W6l7EfkE';

export const supabase = createClient(supabaseUrl, supabaseKey);