export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight for cross-origin requests from Firebase
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Proxy logic for NVIDIA NIM API
    if (url.pathname.startsWith('/nim-api/')) {
      const targetUrl = 'https://integrate.api.nvidia.com' + url.pathname.replace('/nim-api', '') + url.search;
      
      // Filter headers to avoid sending Host/Origin which might break the upstream
      const headers = new Headers();
      headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
      headers.set('Authorization', request.headers.get('Authorization'));

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
        redirect: 'follow',
      });

      const response = await fetch(proxyRequest);
      
      // Recreate the response to inject CORS headers
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      return newResponse;
    }

    // Serve static assets for all other requests
    return env.ASSETS.fetch(request);
  }
};
