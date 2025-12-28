-- Add restrictive SELECT policy to prevent unauthorized access to newsletter subscriber data
CREATE POLICY "Deny all SELECT on newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (false);