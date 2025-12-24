import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Booking {
  id: string;
  user_id: string;
  booking_reference: string;
  flight_data: Record<string, unknown>;
  passenger_last_name: string;
  created_at: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
}

function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as Booking[]) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (
    flightData: Record<string, unknown>,
    passengerLastName: string
  ): Promise<Booking | null> => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to book a flight.',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const bookingReference = generateBookingReference();
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          booking_reference: bookingReference,
          flight_data: flightData as unknown as Record<string, never>,
          passenger_last_name: passengerLastName,
          status: 'confirmed',
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Booking Confirmed!',
        description: `Your booking reference is ${bookingReference}`,
      });

      await fetchBookings();
      return data as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'Unable to complete your booking. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const findBooking = async (
    bookingReference: string,
    lastName: string
  ): Promise<Booking | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_reference', bookingReference.toUpperCase())
        .ilike('passenger_last_name', lastName)
        .maybeSingle();

      if (error) throw error;
      return data as Booking | null;
    } catch (error) {
      console.error('Error finding booking:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (bookingId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'checked_in' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Check-in Complete',
        description: 'You have successfully checked in for your flight.',
      });

      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Error checking in:', error);
      toast({
        title: 'Check-in Failed',
        description: 'Unable to complete check-in. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    createBooking,
    findBooking,
    checkIn,
    refetch: fetchBookings,
  };
}
