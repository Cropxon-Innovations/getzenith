-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own tenant" ON public.tenants;

-- Create a PERMISSIVE INSERT policy for authenticated users
CREATE POLICY "Users can create their own tenant"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (true);