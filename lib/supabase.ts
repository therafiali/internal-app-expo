import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://qrjaavsmkbhzmxnylwfx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyamFhdnNta2Joem14bnlsd2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDQ4NjUsImV4cCI6MjA2NzcyMDg2NX0.UTAMZRRe4H7LessU_nmn80ISJKOaS7NlSjqMmc71zuo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
