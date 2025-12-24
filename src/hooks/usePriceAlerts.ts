import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface PriceAlert {
  id: string;
  user_id: string;
  origin_code: string;
  origin_name: string;
  destination_code: string;
  destination_name: string;
  target_price: number;
  current_price: number | null;
  is_active: boolean;
  last_checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAlerts = useCallback(async () => {
    if (!user) {
      setAlerts([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data as PriceAlert[]) || []);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const createAlert = async (
    originCode: string,
    originName: string,
    destinationCode: string,
    destinationName: string,
    targetPrice: number,
    currentPrice?: number
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to set price alerts.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for existing alert
    const existing = alerts.find(
      a => a.origin_code === originCode && 
           a.destination_code === destinationCode && 
           a.is_active
    );

    if (existing) {
      toast({
        title: 'Alert exists',
        description: 'You already have an active alert for this route.',
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert([{
          user_id: user.id,
          origin_code: originCode,
          origin_name: originName,
          destination_code: destinationCode,
          destination_name: destinationName,
          target_price: targetPrice,
          current_price: currentPrice || null,
          is_active: true,
        }]);

      if (error) throw error;

      toast({
        title: 'Price Alert Created!',
        description: `We'll notify you when ${originCode} → ${destinationCode} drops below $${targetPrice}`,
      });

      await fetchAlerts();
      return true;
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast({
        title: 'Failed to create alert',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (
    alertId: string,
    updates: { target_price?: number; is_active?: boolean }
  ): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Alert Updated',
        description: updates.is_active === false 
          ? 'Price alert has been paused.' 
          : 'Price alert has been updated.',
      });

      await fetchAlerts();
      return true;
    } catch (error) {
      console.error('Error updating price alert:', error);
      toast({
        title: 'Failed to update alert',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Alert Deleted',
        description: 'Price alert has been removed.',
      });

      await fetchAlerts();
      return true;
    } catch (error) {
      console.error('Error deleting price alert:', error);
      toast({
        title: 'Failed to delete alert',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    alerts,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
    refetch: fetchAlerts,
  };
}
