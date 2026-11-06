# Cloudflare Workers KV storage API for serverless KV and edge key value store

This project provides an edge key value store that processes reads and writes through a serverless KV interface.

The Cloudflare Workers KV storage API runs on the Cloudflare global network to execute key-value operations with low latency. It functions as a serverless KV system where clients store and read strings by key. This edge key value store exposes HTTP endpoints for web browsers and backend clients.

## Architecture

The project contains a TypeScript application designed for the Cloudflare Workers runtime. Incoming HTTP requests enter the `fetch` handler in `src/index.ts`. The worker parses URL query parameters, routes commands to the KV namespace, and sends structured HTTP responses.

- The worker runtime runs on Cloudflare Workers using compatibility date `2025-03-27`.
- The storage layer binds the `USER_NOTIFICATION` KV namespace directly to the worker execution environment.
- The CORS handler applies `Access-Control-Allow-Origin: *` to responses and returns HTTP 204 for `OPTIONS` preflight requests.
- The error boundary catches unhandled exceptions and outputs HTTP 500 plain text responses.

## Setup

### Prerequisites

Install Node.js 18 or later and npm. You also need a Cloudflare account with Wrangler authenticated.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/devsanthoshmk/kv-storage.git
cd kv-storage
npm install
```

### Development commands

- `npm run dev` starts the local development server with Wrangler.
- `npm test` runs the test suite with Vitest.
- `npm run cf-typegen` generates TypeScript types from `wrangler.jsonc`.
- `npm run deploy` publishes the worker to Cloudflare Workers.

## Usage

The default production base URL is:

```text
https://techx.connectwithsanthoshmk.workers.dev
```

### Store or update a key

Send a `POST` request with `key` and `value` query parameters to write data.

Endpoint:

```text
POST /?key=<KEY>&value=<VALUE>
```

Query parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | The key to store the value under. |
| `value` | string | Yes | The string value to store. |

Example curl request:

```bash
curl -X POST "https://techx.connectwithsanthoshmk.workers.dev/?key=user_2&value=enabled"
```

Response:

```text
Stored: user_2 = enabled
```

### Retrieve a key

Send a `GET` request with a `key` query parameter to read data.

Endpoint:

```text
GET /?key=<KEY>
```

Query parameters:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | The key to retrieve from storage. |

Example curl request:

```bash
curl "https://techx.connectwithsanthoshmk.workers.dev/?key=user_2"
```

Response:

```text
enabled
```

### Preflight requests

The worker accepts `OPTIONS` requests for browser cross-origin preflight checks.

Response status:

```text
204 No Content
```

Response headers:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### HTTP status codes

| Status code | Condition |
|---|---|
| 200 | The request succeeded. Returns the stored text or confirmation string. |
| 204 | The preflight `OPTIONS` request succeeded. |
| 400 | The query omitted `key`, or a `POST` request omitted `value`. |
| 404 | The requested key does not exist in KV storage. |
| 405 | The client sent an HTTP method other than `GET`, `POST`, or `OPTIONS`. |
| 500 | The worker caught an unexpected error during KV access. |

## Configuration

The file `wrangler.jsonc` configures the worker execution environment and KV bindings.

| Configuration field | Value | Purpose |
|---|---|---|
| `name` | `techx` | Defines the worker project name. |
| `main` | `src/index.ts` | Identifies the primary worker entry point. |
| `compatibility_date` | `2025-03-27` | Fixes the Cloudflare Workers runtime compatibility baseline. |
| `observability.enabled` | `true` | Activates Cloudflare runtime logging and metrics. |
| `kv_namespaces[0].binding` | `USER_NOTIFICATION` | Binds the storage namespace to `env.USER_NOTIFICATION` in code. |
| `kv_namespaces[0].id` | `f556542a8c0c405a95821e8161ec13ed` | Points to the target Cloudflare KV namespace identifier. |

### Custom namespace binding

To link your own KV namespace, run:

```bash
npx wrangler kv namespace create USER_NOTIFICATION
```

Copy the generated namespace ID into `wrangler.jsonc` under `kv_namespaces[0].id`.
