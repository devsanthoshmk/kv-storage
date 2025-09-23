interface Env {
  USER_NOTIFICATION: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);

      // Handle CORS preflight requests
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*", // or set a specific origin
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      const key = url.searchParams.get("key");
      const value = url.searchParams.get("value");

      if (!key) {
        return new Response("Missing ?key parameter", {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }

      let response: Response;

      if (request.method === "POST") {
        if (!value) {
          response = new Response("Missing ?value parameter for POST", {
            status: 400,
          });
        } else {
          await env.USER_NOTIFICATION.put(key, value);
          response = new Response(`Stored: ${key} = ${value}`);
        }
      } else if (request.method === "GET") {
        const storedValue = await env.USER_NOTIFICATION.get(key);
        if (storedValue === null) {
          response = new Response("Value not found", { status: 404 });
        } else {
          response = new Response(storedValue);
        }
      } else {
        response = new Response("Method not allowed", { status: 405 });
      }

      // Add CORS header to all responses
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    } catch (err) {
      console.error("KV returned error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error when accessing KV storage";
      return new Response(errorMessage, {
        status: 500,
        headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
