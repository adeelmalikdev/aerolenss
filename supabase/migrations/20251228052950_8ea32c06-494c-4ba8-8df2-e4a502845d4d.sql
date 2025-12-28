-- Add unsubscribe_token column for secure unsubscription
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN unsubscribe_token UUID DEFAULT gen_random_uuid() NOT NULL;

-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can unsubscribe by setting inactive" ON public.newsletter_subscribers;

-- Create a secure function to handle unsubscribe with token validation
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(p_email TEXT, p_token UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.newsletter_subscribers
  SET is_active = false
  WHERE email = p_email 
    AND unsubscribe_token = p_token
    AND is_active = true;
  
  RETURN FOUND;
END;
$$;