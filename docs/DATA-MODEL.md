# DATA-MODEL.md — Database & Static Content Schemas

## 1. Database Collections (MongoDB)

### 1.1 `requests`
Stores every product request submitted via `/request`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `name` | String | yes | |
| `email` | String | yes | indexed |
| `phone` | String | yes | |
| `flavours` | [String] | yes | array of flavour slugs, e.g. `["masala-cola"]` |
| `size` | String | yes | enum: `200ml,250ml,500ml,750ml,1.5L,2L` |
| `quantity` | Number | yes | integer ≥ 1 |
| `city` | String | no | |
| `message` | String | no | max 500 chars |
| `status` | String | yes | enum: `new, contacted, closed` — default `new` |
| `statusToken` | String | no | random token for optional public status-check link |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

Indexes: `email`, `status`, `createdAt` (desc), `statusToken` (unique, sparse).

---

### 1.2 `inquiries`
Stores general Contact Us submissions.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `name` | String | yes | |
| `email` | String | yes | |
| `message` | String | yes | max 1000 chars |
| `createdAt` | Date | auto | |

Indexes: `createdAt` (desc).

---

### 1.3 `adminusers`
Single admin account (or a small handful, if multiple staff need access later).

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `username` | String | yes | unique |
| `passwordHash` | String | yes | bcrypt hash, never plaintext |
| `createdAt` | Date | auto | |

Seeded once via a script (`backend/scripts/seedAdmin.js`), not created via any public API
route.

---

## 2. Static Frontend Content — `frontend/src/data/flavours.js`

This is NOT stored in the database. It is static content shipped with the frontend, sourced
directly from the client's product catalogue PDF.

```js
export const flavours = [
  {
    slug: "masala-cola",
    name: "Masala Cola",
    collection: "classic",
    color: "#2A1810", // dark brown/black
    tagline: "Bold cola, rounded off with classic Indian masala spice.",
    description: "Bold cola, rounded off with classic Indian masala spice.",
  },
  {
    slug: "nimbu-soda",
    name: "Nimbu Soda",
    collection: "classic",
    color: "#C6D82E", // lime green
    tagline: "Sharp, zesty lemon with a clean, snappy fizz.",
    description: "Sharp, zesty lemon with a clean, snappy fizz.",
  },
  {
    slug: "orange-crush",
    name: "Orange Crush",
    collection: "classic",
    color: "#F07E1A", // orange
    tagline: "Bright, juicy orange with a true fruit finish.",
    description: "Bright, juicy orange with a true fruit finish.",
  },
  {
    slug: "kala-khatta",
    name: "Kala Khatta",
    collection: "classic",
    color: "#4B1152", // deep purple
    tagline: "Tangy-sweet black currant, a street-food classic.",
    description: "Tangy-sweet black currant, a street-food classic.",
  },
  {
    slug: "jeera-masala",
    name: "Jeera Masala",
    collection: "exotic",
    color: "#8A5A2B", // brown
    tagline: "Roasted cumin and spice — cooling, savoury, moreish.",
    description: "Roasted cumin and spice — cooling, savoury, moreish.",
  },
  {
    slug: "rose",
    name: "Rose",
    collection: "exotic",
    color: "#D6296B", // pink/magenta
    tagline: "Delicate rose syrup, floral and smooth on the way down.",
    description: "Delicate rose syrup, floral and smooth on the way down.",
  },
  {
    slug: "pineapple",
    name: "Pineapple",
    collection: "exotic",
    color: "#F2B705", // yellow/gold
    tagline: "Tropical and syrup-sweet, no artificial edge.",
    description: "Tropical and syrup-sweet, no artificial edge.",
  },
  {
    slug: "green-apple",
    name: "Green Apple",
    collection: "exotic",
    color: "#5B9A32", // green
    tagline: "Crisp, tart green apple with a sharp, clean finish.",
    description: "Crisp, tart green apple with a sharp, clean finish.",
  },
];

export const sizes = [
  { value: "200ml", label: "Single serve" },
  { value: "250ml", label: "On the go" },
  { value: "500ml", label: "Personal bottle" },
  { value: "750ml", label: "Share size" },
  { value: "1.5L",  label: "Family pack" },
  { value: "2L",    label: "Party pack" },
];

export const qualityPillars = [
  { title: "Pure Ingredients", body: "No shortcuts in the mix — clean ingredients, clearly listed." },
  { title: "Refreshing Taste", body: "Carbonation and flavour balanced for a genuinely crisp sip." },
  { title: "Quality You Can Trust", body: "Checked at every stage, from batching through to bottling." },
  { title: "Healthier Choices", body: "Recipes built with better-for-you choices in mind." },
];

export const distributionCities = [
  "Ahmedabad", "Mumbai", "Delhi NCR", "Jaipur", "Lucknow",
  "Kolkata", "Hyderabad", "Bengaluru", "Chennai", "Pune",
];
```

> Note: exact hex colors above are approximations from the catalogue swatches — confirm
> final brand hex codes with the client or extract precisely from their brand guidelines if
> available.

---

## 3. Optional Feature: No-Login Status Check
If implemented (see PLAN.md §9, API.md `/api/requests/status/:token`):
- On request creation, generate a random `statusToken` (e.g., `crypto.randomUUID()`) and
  store it on the request document.
- Include a link in the confirmation email: `https://<domain>/request/status/:token`.
- Public frontend route `/request/status/:token` calls `GET /api/requests/status/:token`
  and displays name, flavour(s), and current status — read-only, no auth needed.
- This token should NOT be guessable/sequential — use a UUID or crypto-random string.

---

## 4. Environment Variables Reference

### `backend/.env.example`
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/superfoods_prod
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=24h
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=<gmail-app-password>
OWNER_NOTIFICATION_EMAIL=owner@example.com
FRONTEND_ORIGIN=https://superfoods.example.com
```

### `frontend/.env.example`
```
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```
