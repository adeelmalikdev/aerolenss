-- Drop the insecure DELETE policy
DROP POLICY IF EXISTS "Users can unsubscribe from newsletter" ON public.newsletter_subscribers;

-- Create a secure UPDATE policy that only allows setting is_active to false
-- This prevents mass deletion while still allowing unsubscribe functionality
CREATE POLICY "Anyone can unsubscribe by setting inactive" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (true)
WITH CHECK (is_active = false);