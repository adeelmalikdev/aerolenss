import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('Auth error:', authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { origin, destination, departureDate, returnDate, adults, children, infants, cabinClass, nonStop } = await req.json();

    if (!origin || !destination || !departureDate) {
      throw new Error('Missing required parameters: origin, destination, departureDate');
    }

    // Get auth token from internal amadeus-auth function
    const authResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/amadeus-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
    });

    if (!authResponse.ok) {
      throw new Error('Failed to get Amadeus auth token');
    }

    const { access_token } = await authResponse.json();

    // Build query parameters
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: String(adults || 1),
      currencyCode: 'USD',
      max: '50',
    });

    if (returnDate) {
      params.append('returnDate', returnDate);
    }

    if (children && children > 0) {
      params.append('children', String(children));
    }

    if (infants && infants > 0) {
      params.append('infants', String(infants));
    }

    if (cabinClass) {
      params.append('travelClass', cabinClass);
    }

    if (nonStop) {
      params.append('nonStop', 'true');
    }

    console.log('Searching flights:', params.toString());
    
    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amadeus flight search error:', errorText);
      throw new Error(`Flight search failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Found flights:', data.data?.length || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-flights:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', data: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
