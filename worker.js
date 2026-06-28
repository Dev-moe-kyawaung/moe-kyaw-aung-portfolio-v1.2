const routes = {
  "/": "/index.html",
  "/about": "/about.html",
  "/projects": "/projects.html",
  "/services": "/services.html",
  "/pricing": "/pricing.html",
  "/certificates": "/certificates.html",
  "/testimonials": "/testimonials.html",
  "/faq": "/faq.html",
  "/contact": "/contact.html",
  "/privacy": "/privacy.html",
  "/mail-collection": "/mail-collection.html"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(//+$/, "") || "/";

    if (routes[path]) {
      const res = await env.ASSETS.fetch(new Request(new URL(routes[path], url), request));
      return addSecurityHeaders(res);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return addSecurityHeaders(assetResponse);
    }

    const notFound = await env.ASSETS.fetch(new Request(new URL("/404.html", url), request));
    return addSecurityHeaders(notFound, 404);
  }
};

function addSecurityHeaders(response, overrideStatus) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "geolocation=(), camera=(), microphone=()");
  headers.set("cache-control", "public, max-age=300");
  return new Response(response.body, {
    status: overrideStatus || response.status,
    headers
  });
}
