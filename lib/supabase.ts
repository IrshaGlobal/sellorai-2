import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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