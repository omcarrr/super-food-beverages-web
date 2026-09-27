# API.md — Backend Route Reference

Base URL:
- Local: `http://localhost:5000/api`
- Production: `https://<your-render-service>.onrender.com/api`

All request/response bodies are JSON. All timestamps are ISO 8601 UTC.

---

## Auth (Admin only)

### `POST /api/admin/login`
Authenticate the admin user and receive a session token.

**Auth required:** No
**Rate limited:** Yes (5 attempts / 15 min / IP)

Request body:
```json
{
  "username": "admin",
  "password": "••••••••"
}
```

Response `200 OK`:
```json
{
  "token": "eyJhbGciOi...",
  "expiresIn": "24h"
}
```
(Alternative: token set as httpOnly cookie instead of returned in body — decide during
implementation based on frontend hosting setup.)

Response `401 Unauthorized`:
```json
{ "error": "Invalid credentials" }
```

---

### `POST /api/admin/logout`
Invalidate the current session (if using cookie-based sessions; no-op if using stateless JWT
with client-side token discard).

**Auth required:** Yes

Response `200 OK`:
```json
{ "message": "Logged out" }
```

---

## Requests (public-facing "order request" form)

### `POST /api/requests`
Submit a new product request. Triggers an email notification to the business owner.

**Auth required:** No
**Rate limited:** Yes (5 / 15 min / IP)
**Spam protection:** Honeypot field `website` must be empty; request rejected silently
(`200 OK` with no DB write) if filled.

Request body:
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "+91 98765 43210",
  "flavours": ["masala-cola", "kala-khatta"],
  "size": "1L",
  "quantity": 24,
  "city": "Chennai",
  "message": "Need this for a small shop, please call.",
  "website": ""
}
```

Field notes:
| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | yes | 2–100 chars |
| email | string | yes | valid email format |
| phone | string | yes | basic phone format validation |
| flavours | string[] | yes | at least 1; values must match known flavour slugs |
| size | string | yes | one of: `200ml`,`250ml`,`500ml`,`750ml`,`1.5L`,`2L` |
| quantity | number | yes | integer, min 1 |
| city | string | no | free text |
| message | string | no | max 500 chars |
| website | string | no (honeypot) | must be empty |

Response `201 Created`:
```json
{
  "id": "665f1b2e...",
  "status": "new",
  "createdAt": "2026-09-27T10:15:00.000Z",
  "statusLink": "https://superfoods.example.com/request/status/9f8c2a..."
}
```
(`statusLink` only included if the optional no-login status-check feature is implemented —
see DATA-MODEL.md §3.)

Response `400 Bad Request`:
```json
{ "error": "Validation failed", "details": [ { "field": "email", "message": "Invalid email" } ] }
```

---

### `GET /api/requests`
List all requests. Admin only.

**Auth required:** Yes (admin JWT)
**Query params:** `status` (optional: `new`|`contacted`|`closed`), `page`, `limit`

Response `200 OK`:
```json
{
  "total": 42,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "665f1b2e...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "+91 98765 43210",
      "flavours": ["masala-cola", "kala-khatta"],
      "size": "1L",
      "quantity": 24,
      "city": "Chennai",
      "message": "Need this for a small shop, please call.",
      "status": "new",
      "createdAt": "2026-09-27T10:15:00.000Z"
    }
  ]
}
```

---

### `GET /api/requests/:id`
Get full detail of a single request. Admin only.

**Auth required:** Yes

Response `200 OK`: same shape as a single item above.
Response `404 Not Found`: `{ "error": "Request not found" }`

---

### `PATCH /api/requests/:id`
Update a request's status. Admin only.

**Auth required:** Yes

Request body:
```json
{ "status": "contacted" }
```
Allowed values: `new`, `contacted`, `closed`

Response `200 OK`: updated request object.

---

### `GET /api/requests/status/:token` *(optional feature)*
Public, no-login lookup of a request's status via a private token mailed to the customer.

**Auth required:** No
**Rate limited:** Yes

Response `200 OK`:
```json
{
  "name": "Ravi Kumar",
  "flavours": ["masala-cola", "kala-khatta"],
  "size": "1L",
  "quantity": 24,
  "status": "contacted",
  "createdAt": "2026-09-27T10:15:00.000Z"
}
```
Response `404 Not Found`: invalid/expired token.

---

## Inquiries (general Contact Us form)

### `POST /api/inquiries`
Submit a general contact inquiry. Triggers an email notification to the owner.

**Auth required:** No
**Rate limited:** Yes (5 / 15 min / IP)

Request body:
```json
{
  "name": "Priya Shah",
  "email": "priya@example.com",
  "message": "Interested in becoming a distributor in Pune.",
  "website": ""
}
```

Response `201 Created`:
```json
{ "id": "665f1c9a...", "createdAt": "2026-09-27T10:20:00.000Z" }
```

---

### `GET /api/inquiries`
List all contact inquiries. Admin only. Same pagination pattern as `/api/requests`.

**Auth required:** Yes

---

## Health Check

### `GET /api/health`
Simple uptime check (also helps mitigate Render free-tier cold starts if pinged periodically).

**Auth required:** No

Response `200 OK`:
```json
{ "status": "ok", "timestamp": "2026-09-27T10:00:00.000Z" }
```

---

## Error Format (all endpoints)
```json
{ "error": "Human readable message", "details": [] }
```
| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Missing/invalid auth token |
| 403 | Valid token, insufficient permission |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |
