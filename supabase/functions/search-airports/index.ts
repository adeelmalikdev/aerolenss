import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const searchAirportsSchema = z.object({
  keyword: z.string()
    .min(2, "Keyword must be at least 2 characters")
    .max(50, "Keyword must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-']+$/, "Keyword contains invalid characters")
    .transform(val => val.trim())
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // NOTE: This endpoint is intentionally public (no user auth required)
    // Keep input validation below to prevent abuse / injection.

    // Parse and validate input
    const rawBody = await req.json();
    const keyword = rawBody?.keyword?.trim?.() || '';
    
    // Return empty results for short queries (less than 2 chars) - not an error
    if (keyword.length < 2) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Validate remaining constraints
    const validationResult = searchAirportsSchema.safeParse({ keyword });
    
    if (!validationResult.success) {
      console.log('Validation error:', validationResult.error.errors);
      // Return empty array instead of error for invalid input
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validatedKeyword = validationResult.data.keyword;

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

    console.log('Searching airports for:', validatedKeyword);
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(validatedKeyword)}&page[limit]=10`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Amadeus API error:', response.status);
      // Handle rate limiting gracefully - return empty results instead of error
      if (response.status === 429) {
        console.log('Rate limited by Amadeus API, returning empty results');
        return new Response(JSON.stringify({ data: [], rateLimited: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Search failed', data: [] }), {
        status: 200, // Return 200 with empty data instead of 502 to avoid breaking UI
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Found airports:', data.data?.length || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-airports:', error);
    return new Response(JSON.stringify({ error: 'An error occurred', data: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
