-- Add UPDATE policy for saved_searches table
CREATE POLICY "Users can update their own saved searches"
  ON public.saved_searches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add length constraint to the profiles table for full_name
ALTER TABLE public.profiles 
ADD CONSTRAINT full_name_length_check 
CHECK (char_length(full_name) <= 255);

-- Update handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  -- Extract and validate full_name
  v_full_name := TRIM(NEW.raw_user_meta_data ->> 'full_name');
  
  -- Apply length constraint
  IF v_full_name IS NOT NULL AND char_length(v_full_name) > 255 THEN
    v_full_name := SUBSTRING(v_full_name, 1, 255);
  END IF;
  
  -- Reject if it contains only whitespace
  IF v_full_name IS NOT NULL AND char_length(TRIM(v_full_name)) = 0 THEN
    v_full_name := NULL;
  END IF;
  
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, v_full_name);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    -- Insert with NULL full_name as fallback
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NULL)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;