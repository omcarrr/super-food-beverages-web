# PLAN.md — Super Foods & Beverages Website

## 1. Project Summary
A marketing + lead-generation website for **Super Foods & Beverages** ("Har Boond Mein Taazgi").
The site showcases the brand's 8 soft drink flavours with strong visual/scroll animation
(inspired by Olipop, Poppi, Paper Boat, 7UP), and lets visitors submit a **request** for a
flavour/size/quantity. The business owner follows up manually via phone/email — there is
**no online checkout, no payments, no user accounts, and no order tracking** in v1.

## 2. Goals
- Make the brand and its flavours look premium and desirable (primary goal).
- Give visitors an easy, low-friction way to express interest ("Request").
- Give the owner a simple place to see and manage incoming requests (Admin).
- Keep cost near-zero (free tiers) and the codebase simple enough for one dev to maintain.

## 3. Non-Goals (explicitly out of scope for v1)
- No payment gateway / checkout.
- No user accounts, login, or order history/tracking for customers.
- No inventory management.
- No multi-language support (v1 is English only).
- No CMS for non-technical content editing — flavour/product content is static in the codebase
  (fast to build, safe to change later).

## 4. Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | React + Vite | Fast dev, small bundle |
| Styling | Tailwind CSS | Utility-first, fast to theme per flavour color |
| Animation | GSAP + ScrollTrigger | Scroll-pinned sections, flavour reveal animations |
| Smooth scroll | Lenis (optional) | Pairs well with GSAP ScrollTrigger |
| Frontend hosting | Vercel (free tier) | Auto preview deploys per branch/PR |
| Backend | Node.js + Express | Simple REST API |
| Backend hosting | Render (free tier to start) | Cold starts ~30-50s on free tier — acceptable at low volume |
| Database | MongoDB Atlas M0 (free) | 512MB, enough for request records |
| Email | Nodemailer + Gmail SMTP | Notify owner on new request; optional confirmation to customer |
| Domain | Client's own GoDaddy account | Do NOT register under developer's personal account |

## 5. Site Map (Frontend Routes)
```
/                        Landing page (hero + animated flavour scroll showcase)
/flavours                Flavours hub (grid of all 8, filter by collection)
/flavours/:slug          Individual flavour detail page
/about                   Brand story, quality pillars, distribution reach
/contact                 Contact info + general inquiry form
/request                 Request form (flavour/size/qty) — no login required
/admin/login             Admin login
/admin/dashboard         Protected — list & manage incoming requests
```

## 6. Milestones (Build Order)
Each milestone should be demoable end-to-end before moving to the next.

| # | Milestone | Includes |
|---|---|---|
| M0 | Repo & deploy skeleton | Empty React app deployed to Vercel; empty Express app deployed to Render; MongoDB Atlas cluster created; env vars wired |
| M1 | Static content pages | Flavours hub + detail pages, About, Contact — real content, no animation yet |
| M2 | Landing page animation | GSAP scroll experience, flavour color transitions, hero |
| M3 | Backend core | Request model, `POST /api/requests`, validation, rate limiting |
| M4 | Request form (frontend) | Full form, wired to backend, confirmation screen, email notification to owner |
| M5 | Admin dashboard | Admin login (JWT), requests table, status update (New/Contacted/Closed) |
| M6 | Contact form | General inquiry form + email notification |
| M7 | Polish pass | Responsiveness, animation performance (mobile), loading/error states, accessibility basics |
| M8 | Launch | Domain connected, final QA, client walkthrough, handover docs |

## 7. Branching Strategy
- `main` — always deployable; auto-deploys to production.
- `dev` — integration branch; Vercel preview deploy for staging review.
- `feature/<name>` — one branch per milestone/feature, branched from `dev`, merged back via PR.

Example feature branches:
```
feature/repo-skeleton
feature/flavours-pages
feature/landing-scroll-animation
feature/backend-request-api
feature/request-form
feature/admin-dashboard
feature/contact-form
feature/polish-responsive
```

## 8. Content Source
All flavour names, descriptions, sizes, and brand copy are sourced from the client-provided
PDF: `Super_Foods_and_Beverages_Product_Catalogue.pdf`. See DATA-MODEL.md for the structured
flavour list used in the codebase.

## 9. Open Items / Questions for Client
- Real phone number, email, website, and head office address (catalogue has placeholders only).
- Social media handles (Instagram/Facebook) for footer + social proof section.
- Do they want the confirmation email to include a private "check status" link, or just a
  plain thank-you email? (Recommended: include the link — cheap to add, better UX.)
- Logo file in vector/high-res format (catalogue only has a raster logo).
- Any real product photography, or do we proceed with illustrated/stylized bottle graphics?

## 10. Budget Reference (from client's original cost breakdown)
- Domain: ~Rs 1000/year (client's GoDaddy account)
- Frontend hosting: Rs 0 (Vercel free tier)
- DB: Rs 0 (MongoDB Atlas M0 free tier) — upgrade only if traffic/backup needs grow
- Backend hosting: Rs 0 to start, ~Rs 580/month if upgraded off free tier later
- Email: Rs 0 (Gmail SMTP)
- Total setup cash cost: ~Rs 1000 (domain only)
