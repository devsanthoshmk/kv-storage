interface Env {
  USER_NOTIFICATION: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);

      const key = url.searchParams.get("key");
      const value = url.searchParams.get("value");

      if (!key) {
        return new Response("Missing ?key parameter", { status: 400 });
      }

      if (request.method === "POST") {
        if (!value) {
          return new Response("Missing ?value parameter for POST", { status: 400 });
        }
        await env.USER_NOTIFICATION.put(key, value);
        return new Response(`Stored: ${key} = ${value}`);
      }

      if (request.method === "GET") {
        const storedValue = await env.USER_NOTIFICATION.get(key);
        if (storedValue === null) {
          return new Response("Value not found", { status: 404 });
        }
        return new Response(storedValue);
      }

      return new Response("Method not allowed", { status: 405 });
    } catch (err) {
      console.error("KV returned error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error when accessing KV storage";
      return new Response(errorMessage, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
