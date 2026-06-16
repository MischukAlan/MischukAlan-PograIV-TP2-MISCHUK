import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jyjoyuhnqkoxdxybycuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5am95dWhucW9reGR4eWJ5Y3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzA5MzcsImV4cCI6MjA5Njg0NjkzN30.d_C7TD0Na4v7B1Is6RL3fGvCooRR8VJAaAk72J6IinA';

export const supabase = createClient(supabaseUrl, supabaseKey);