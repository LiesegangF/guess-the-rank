import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://synadhyquuadwcsevxdj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmFkaHlxdXVhZHdjc2V2eGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNjQyNTUsImV4cCI6MjA2MDc0MDI1NX0.M22eeIAI5VIdCdRC1o5eWn7T1Ut5LuRAkOppiWTn_oM";
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getClips() {
    const { data, error } = await supabase
      .from("clips")
      .select("*")
      .order("created_at", { ascending: false });
  
    return { data, error };
  }
  