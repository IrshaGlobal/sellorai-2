import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttwiicpicwcvhygjdmpw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0d2lpY3BpY3djdmh5Z2pkbXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTE4MjAsImV4cCI6MjA2Mzc4NzgyMH0.JjKHyBHch1toOoH1kLAzX3qoWRCPaDlh1Pp5Z0514XQ';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create the standard client with anonymous key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a service role client if the key is available
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Store related functions
export async function getStoreBySubdomain(subdomain: string) {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('subdomain', subdomain)
    .single();
  
  if (error) throw error;
  return data;
}

// Product related functions
export async function getProductsByStore(storeId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId);
  
  if (error) throw error;
  return data;
}

export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  
  if (error) throw error;
  return data;
}

// Order related functions
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createOrderItems(items: any[]) {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items);
  
  if (error) throw error;
  return data;
}

// User related functions
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUser(userData: any) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}