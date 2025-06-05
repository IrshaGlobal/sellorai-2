import { NextApiRequest } from 'next';
import { supabase } from './supabase';

export interface AuthUser {
  email: string;
  storeId: string;
  role?: string;
}

/**
 * Middleware to check if user is authenticated using Supabase Auth
 */
export async function isAuthenticated(req: NextApiRequest): Promise<AuthUser | null> {
  try {
    // First try to get the session from the cookie
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      // If no session from cookie, try to get from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
          return null;
        }
        
        // Get user details from our database
        let userDetails;
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, role')
          .eq('email', user.email)
          .single();
          
        if (userError || !userData) {
          // Create user record if it doesn't exist
          try {
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert([{ email: user.email, role: 'vendor' }])
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating user record:', createError);
              return null;
            }
            
            userDetails = newUser;
          } catch (err) {
            console.error('Error creating user record:', err);
            return null;
          }
        } else {
          userDetails = userData;
        }
        
        // Get store information
        const { data: storeData } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', user.email)
          .single();
          
        return {
          email: user.email!,
          storeId: storeData?.id || '',
          role: userDetails.role
        };
      }
      
      return null;
    }
    
    // Get user details from our database
    let userDetails;
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', session.user.email)
      .single();
      
    if (userError || !userData) {
      // Create user record if it doesn't exist
      try {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ email: session.user.email, role: 'vendor' }])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating user record:', createError);
          return null;
        }
        
        userDetails = newUser;
      } catch (err) {
        console.error('Error creating user record:', err);
        return null;
      }
    } else {
      userDetails = userData;
    }
    
    // Get store information
    const { data: storeData } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', session.user.email)
      .single();
      
    return {
      email: session.user.email!,
      storeId: storeData?.id || '',
      role: userDetails.role
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Function to sign in a user with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Function to sign up a new user
 */
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'vendor'
      }
    }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Function to sign out a user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
}