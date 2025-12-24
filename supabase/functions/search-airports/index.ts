import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword } = await req.json();

    if (!keyword || keyword.length < 2) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get auth token
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

    console.log('Searching airports for:', keyword);
    const response = await fetch(
      `https://api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amadeus API error:', errorText);
      throw new Error(`Amadeus API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Found airports:', data.data?.length || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-airports:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', data: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
