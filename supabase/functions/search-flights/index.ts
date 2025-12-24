import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const searchFlightsSchema = z.object({
  origin: z.string()
    .length(3, "Origin must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Origin must be uppercase letters only")
    .transform(val => val.toUpperCase()),
  destination: z.string()
    .length(3, "Destination must be a 3-letter IATA code")
    .regex(/^[A-Z]{3}$/, "Destination must be uppercase letters only")
    .transform(val => val.toUpperCase()),
  departureDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Departure date must be YYYY-MM-DD format"),
  returnDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Return date must be YYYY-MM-DD format")
    .optional()
    .nullable(),
  adults: z.number().int().min(1).max(9).default(1),
  children: z.number().int().min(0).max(8).default(0).optional(),
  infants: z.number().int().min(0).max(4).default(0).optional(),
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']).optional(),
  nonStop: z.boolean().default(false).optional(),
});

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

    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = searchFlightsSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.log('Validation error:', validationResult.error.errors);
      return new Response(JSON.stringify({ 
        error: 'Invalid search parameters', 
        data: [] 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { origin, destination, departureDate, returnDate, adults, children, infants, cabinClass, nonStop } = validationResult.data;

    // Get auth token from internal amadeus-auth function
    const authResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/amadeus-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
    });

    if (!authResponse.ok) {
      console.error('Failed to get Amadeus auth token');
      return new Response(JSON.stringify({ error: 'Service unavailable', data: [] }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { access_token } = await authResponse.json();

    // Build query parameters
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: String(adults),
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
      console.error('Amadeus flight search error:', response.status);
      return new Response(JSON.stringify({ error: 'Flight search failed', data: [] }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Found flights:', data.data?.length || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-flights:', error);
    return new Response(JSON.stringify({ error: 'An error occurred', data: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
