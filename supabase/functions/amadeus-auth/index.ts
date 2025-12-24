import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let cachedToken: { access_token: string; expires_at: number } | null = null;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AMADEUS_API_KEY = Deno.env.get('AMADEUS_API_KEY');
    const AMADEUS_API_SECRET = Deno.env.get('AMADEUS_API_SECRET');

    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      throw new Error('Amadeus API credentials not configured');
    }

    // Check if we have a valid cached token
    if (cachedToken && cachedToken.expires_at > Date.now()) {
      console.log('Using cached Amadeus token');
      return new Response(JSON.stringify({ access_token: cachedToken.access_token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching new Amadeus token');
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amadeus auth error:', errorText);
      throw new Error(`Amadeus authentication failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the token (expires_in is in seconds, subtract 60 for safety margin)
    cachedToken = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 60) * 1000,
    };

    return new Response(JSON.stringify({ access_token: data.access_token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in amadeus-auth:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
