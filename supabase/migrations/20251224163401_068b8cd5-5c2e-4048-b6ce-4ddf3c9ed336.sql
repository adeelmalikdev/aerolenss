-- Price alerts table for tracking route price drops
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  origin_code TEXT NOT NULL,
  origin_name TEXT NOT NULL,
  destination_code TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own alerts
CREATE POLICY "Users can view own price alerts" ON public.price_alerts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create alerts
CREATE POLICY "Users can create price alerts" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update own price alerts" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own price alerts" ON public.price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = true;