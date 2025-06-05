// lib/refresh-schema.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttwiicpicwcvhygjdmpw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0d2lpY3BpY3djdmh5Z2pkbXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTE4MjAsImV4cCI6MjA2Mzc4NzgyMH0.JjKHyBHch1toOoH1kLAzX3qoWRCPaDlh1Pp5Z0514XQ';

// Create the standard client with anonymous key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function refreshSchema() {
  try {
    // Force refresh the schema cache
    await supabase.rpc('refresh_schema_cache');
    console.log('Schema cache refreshed successfully');
  } catch (error) {
    console.error('Schema refresh error:', error);
  }
}

refreshSchema();