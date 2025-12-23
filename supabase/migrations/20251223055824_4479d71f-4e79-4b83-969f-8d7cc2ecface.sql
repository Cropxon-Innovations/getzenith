-- Allow authenticated users to create tenants (needed for signup flow)
CREATE POLICY "Users can create their own tenant" 
ON public.tenants 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert their own user_roles
CREATE POLICY "Users can create their own role" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());