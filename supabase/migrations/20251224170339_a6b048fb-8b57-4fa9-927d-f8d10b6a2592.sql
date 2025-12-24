-- Add DELETE policy for newsletter_subscribers (allows unsubscribe functionality)
-- Users can delete their own subscription by matching their email
CREATE POLICY "Users can unsubscribe from newsletter" 
ON public.newsletter_subscribers 
FOR DELETE 
USING (true);

-- Add DELETE policy for bookings (allows users to cancel their own bookings)
CREATE POLICY "Users can delete own bookings" 
ON public.bookings 
FOR DELETE 
USING (auth.uid() = user_id);