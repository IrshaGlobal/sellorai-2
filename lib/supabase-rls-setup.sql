-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow authenticated users to insert their own data
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow authenticated users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow service role to manage all users
CREATE POLICY "Service role can manage all users" ON users
  USING (auth.role() = 'service_role');

-- Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own stores
CREATE POLICY "Users can read their own stores" ON stores
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow authenticated users to insert their own stores
CREATE POLICY "Users can insert their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow authenticated users to update their own stores
CREATE POLICY "Users can update their own stores" ON stores
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all stores
CREATE POLICY "Service role can manage all stores" ON stores
  USING (auth.role() = 'service_role');