import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const searchHotelsSchema = z.object({
  cityCode: z.string().min(3).max(3),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().min(1).max(9).default(1),
  rooms: z.number().min(1).max(9).default(1),
  currency: z.string().length(3).optional().default('USD'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Hotel search request:', JSON.stringify(body));

    const validatedParams = searchHotelsSchema.parse(body);
    console.log('Validated params:', JSON.stringify(validatedParams));

    // Get Amadeus token
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    const tokenResponse = await fetch(`${supabaseUrl}/functions/v1/amadeus-auth`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Auth error:', errorText);
      throw new Error('Failed to get Amadeus auth token');
    }

    const { access_token } = await tokenResponse.json();
    console.log('Got Amadeus token');

    // First, get hotel list by city
    const hotelListParams = new URLSearchParams({
      cityCode: validatedParams.cityCode,
    });

    console.log('Fetching hotels for city:', validatedParams.cityCode);
    const hotelListResponse = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?${hotelListParams}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!hotelListResponse.ok) {
      const errorText = await hotelListResponse.text();
      console.error('Hotel list error:', errorText);
      throw new Error(`Failed to fetch hotels: ${hotelListResponse.status}`);
    }

    const hotelListData = await hotelListResponse.json();
    console.log(`Found ${hotelListData.data?.length || 0} hotels in city`);

    if (!hotelListData.data || hotelListData.data.length === 0) {
      return new Response(JSON.stringify({ data: [], dictionaries: {} }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Take first 20 hotels for offers search
    const hotelIds = hotelListData.data.slice(0, 20).map((h: any) => h.hotelId).join(',');

    // Now search for offers
    const offersParams = new URLSearchParams({
      hotelIds,
      adults: String(validatedParams.adults),
      checkInDate: validatedParams.checkInDate,
      checkOutDate: validatedParams.checkOutDate,
      roomQuantity: String(validatedParams.rooms),
      currency: validatedParams.currency,
      bestRateOnly: 'true',
    });

    console.log('Fetching hotel offers...');
    const offersResponse = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?${offersParams}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!offersResponse.ok) {
      const errorText = await offersResponse.text();
      console.error('Hotel offers error:', errorText);
      
      // Return empty results if no offers available
      if (offersResponse.status === 400) {
        return new Response(JSON.stringify({ data: [], dictionaries: {} }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Failed to fetch hotel offers: ${offersResponse.status}`);
    }

    const offersData = await offersResponse.json();
    console.log(`Found ${offersData.data?.length || 0} hotel offers`);

    return new Response(JSON.stringify({
      data: offersData.data || [],
      dictionaries: offersData.dictionaries || {},
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-hotels:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input', 
        details: error.errors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
