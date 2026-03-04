// deno-lint-ignore no-import-prefix
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('SYSCOM_CLIENT_ID');
    const clientSecret = Deno.env.get('SYSCOM_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error("Faltan las credenciales de Syscom en la bóveda.");
    }

    let terminoBusqueda = 'camara'; 
    let paginaSolicitada = 1; // La "caja" de 60 que queremos de Syscom

    try {
      const body = await req.json();
      if (body.busqueda) terminoBusqueda = body.busqueda;
      if (body.pagina) paginaSolicitada = body.pagina;
    } catch (_e) {// Ignoramos el error si no mandan un body válido, usamos los valores por defecto
      }

    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    });

    const tokenResponse = await fetch('https://developers.syscom.mx/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Syscom no nos dio el gafete.");

    // Le pedimos a Syscom la palabra clave y la PÁGINA PROFUNDA exacta
    const urlSyscom = `https://developers.syscom.mx/api/v1/productos?busqueda=${encodeURIComponent(terminoBusqueda)}&pagina=${paginaSolicitada}`;
    
    const productosResponse = await fetch(urlSyscom, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });

    const productosData = await productosResponse.json();

    return new Response(JSON.stringify(productosData), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 400, headers: { ...corsHeaders } });
  }
})