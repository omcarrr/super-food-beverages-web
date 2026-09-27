# ARCHITECTURE.md — Super Foods & Beverages Website

## 1. High-Level Overview
```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐
│   Frontend       │ ───────────────────────> │   Backend         │
│   React + Vite   │ <─────────────────────── │   Node + Express  │
│   (Vercel)       │                           │   (Render)        │
└─────────────────┘                           └────────┬──────────┘
                                                          │
                                          ┌───────────────┼───────────────┐
                                          │                               │
                                   ┌──────▼──────┐               ┌────────▼────────┐
                                   │  MongoDB     │               │  Gmail SMTP      │
                                   │  Atlas (M0)  │               │  (Nodemailer)    │
                                   └─────────────┘               └─────────────────┘
```

- Frontend is a static SPA (React) — no server-side rendering needed for v1 SEO requirements.
- Backend is a stateless REST API — no server-side sessions beyond JWT for admin auth.
- Database only stores: submitted requests, contact inquiries, and the single admin user.
  Flavour/product content is NOT stored in the DB — it's static JSON/TS data in the frontend
  (see DATA-MODEL.md §2) since it changes rarely and needs zero editing UI.

## 2. Repository Structure (Monorepo)
```
super-foods-beverages-web/
├── docs/
│   ├── PLAN.md
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DATA-MODEL.md
├── frontend/
│   ├── public/
│   │   └── assets/               (bottle images, logo, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FlavourCard.jsx
│   │   │   ├── SizesStrip.jsx
│   │   │   ├── QualityBadge.jsx
│   │   │   ├── CTAButton.jsx
│   │   │   ├── RequestForm.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── FlavoursHub.jsx
│   │   │   ├── FlavourDetail.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Request.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── data/
│   │   │   └── flavours.js        (static flavour content, see DATA-MODEL.md)
│   │   ├── animations/
│   │   │   └── landingScroll.js   (GSAP ScrollTrigger timelines)
│   │   ├── api/
│   │   │   └── client.js          (fetch wrapper for backend calls)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Request.js
│   │   │   ├── Inquiry.js
│   │   │   └── AdminUser.js
│   │   ├── routes/
│   │   │   ├── requests.routes.js
│   │   │   ├── inquiries.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── requests.controller.js
│   │   │   ├── inquiries.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     (JWT check for admin routes)
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   ├── services/
│   │   │   └── email.service.js       (Nodemailer wrapper)
│   │   ├── config/
│   │   │   └── db.js                  (MongoDB connection)
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 3. Frontend Architecture Notes
- **Routing**: React Router (`react-router-dom`).
- **Styling**: Tailwind CSS, with a per-flavour color token map (matches catalogue swatch
  colors) used across FlavourCard, FlavourDetail hero background, and landing scroll panels.
- **Animation**: GSAP + ScrollTrigger, registered once in `main.jsx`. Landing page scroll
  timeline lives in `animations/landingScroll.js`, imported only by `Landing.jsx` to keep
  bundle size down on other pages.
- **State**: No global state library needed for v1 — local component state + URL params
  (e.g., `/request?flavour=masala-cola`) is sufficient.
- **API calls**: Centralized in `api/client.js` — single place to change the backend base
  URL via `VITE_API_BASE_URL` env var.

## 4. Backend Architecture Notes
- **Framework**: Express, organized by route → controller → model (simple layered structure,
  no need for a heavier framework at this scale).
- **Auth**: Single admin user seeded manually in the DB (or via a one-time seed script).
  Login issues a JWT (short-lived, e.g., 24h), stored in an httpOnly cookie or returned to
  frontend and stored in memory/localStorage (cookie preferred for security).
- **Validation**: `express-validator` or `zod` on all POST/PATCH bodies.
- **Rate limiting**: `express-rate-limit` on `/api/requests` and `/api/inquiries` to prevent
  spam (e.g., 5 requests per IP per 15 minutes).
- **Email**: `nodemailer` with Gmail SMTP (app password, not real Gmail password) — one
  service function `sendMail(to, subject, html)` used by both request and inquiry flows.
- **CORS**: Restricted to the deployed frontend origin only.

## 5. Environments & Deployment
| Environment | Frontend | Backend | DB |
|---|---|---|---|
| Local dev | `localhost:5173` (Vite) | `localhost:5000` | Local `.env` points to Atlas dev cluster or local Mongo |
| Staging | Vercel preview deploy (per PR/branch) | Render (dev branch, if separate service used) | Atlas (same cluster, separate DB name e.g. `superfoods_staging`) |
| Production | Vercel production (main branch) | Render production service (main branch) | Atlas (`superfoods_prod`) |

- Vercel auto-deploys preview URLs for every branch/PR — use this for client review before
  merging to `main`.
- Render: connect the `backend` folder as the deploy root; set environment variables in
  Render's dashboard, never commit them.

## 6. Security Notes
- All secrets (Mongo URI, JWT secret, Gmail app password) live in environment variables,
  never in the repo.
- Admin routes protected by JWT middleware; no route other than `/api/admin/login` is public
  under `/api/admin/*`.
- Input sanitization on all public-facing endpoints (`/api/requests`, `/api/inquiries`) to
  prevent injection/XSS payloads being stored and later rendered in the admin dashboard.
- HTTPS enforced automatically by Vercel/Render.

## 7. Why no CMS / no DB-backed flavour content
The flavour list (8 items) is fixed, sourced from the client's catalogue, and expected to
change infrequently (maybe once a year with a catalogue refresh). Storing it as static
frontend data:
- Avoids building an admin content-editing UI (out of scope/budget for v1).
- Avoids extra API calls / loading states for content that never changes at runtime.
- Still easy to update — a developer edits `frontend/src/data/flavours.js` and redeploys.

If the client later wants self-service content editing, this can be migrated to a `Flavour`
collection in MongoDB + simple admin CRUD screens as a v2 addition.
