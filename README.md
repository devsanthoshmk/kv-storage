# KV Worker API

A simple Cloudflare Worker API to store and retrieve key-value pairs using KV storage.  
Supports **only GET and POST methods**. Ideal for small, permanent storage like a single link.

**Base URL:**  
https://techx.connectwithsanthoshmk.workers.dev/

---

## API Methods

### 1. POST – Store/Edit a Value

Stores a value for a given key in KV storage.

**Request URL:**  
```
POST https://techx.connectwithsanthoshmk.workers.dev/?key=<KEY>&value=<VALUE>
```

**Query Parameters:**

| Parameter | Type   | Description                  | Required |
|-----------|--------|------------------------------|----------|
| key       | string | The key to store the value under | Yes      |
| value     | string | The value to store           | Yes      |

**Response:**  
```
Stored: <KEY> = <VALUE>
```

**Example using curl:**
```bash
curl -X POST "https://techx.connectwithsanthoshmk.workers.dev/?key=user_2&value=enabled"
```

**Response:**
```
Stored: user_2 = enabled
```

---

### 2. GET – Retrieve a Value

Retrieves the value for a given key from KV storage.

**Request URL:**  
```
GET https://techx.connectwithsanthoshmk.workers.dev/?key=<KEY>
```

**Query Parameters:**

| Parameter | Type   | Description          | Required |
|-----------|--------|--------------------|----------|
| key       | string | The key to retrieve | Yes      |

**Response:**

- Returns the stored value as plain text.  
- If the key is not found, returns `404` with `"Value not found"`.

**Example using curl:**
```bash
curl "https://techx.connectwithsanthoshmk.workers.dev/?key=user_2"
```

**Response:**
```
enabled
```

---

## Error Handling

| Status Code | Description                                         |
|-------------|-----------------------------------------------------|
| 400         | Missing `?key` parameter, or missing `?value` for POST |
| 404         | Key not found in KV storage                         |
| 405         | Method not allowed (any method other than GET/POST)|
| 500         | Internal server error / KV access error            |

---

## Notes

- Only supports **GET** and **POST** methods.  
- Ensure your KV namespace is properly bound in the Worker.  
- Safe for storing **small amounts of permanent data**.

---

## Example Use Cases

- Store a permanent link or short URL.  
- Save simple user settings or flags.  
- Lightweight key-value API for front-end apps.
