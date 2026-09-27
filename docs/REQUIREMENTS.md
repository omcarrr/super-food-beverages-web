# REQUIREMENTS.md — Super Foods & Beverages Website

## 1. Functional Requirements

### 1.1 Landing Page
- FR-1.1.1: Display a hero section with brand name, tagline, and logo.
- FR-1.1.2: Provide a long-scroll animated sequence introducing all 8 flavours, with
  background color transitioning to match each flavour's brand color.
- FR-1.1.3: Display the brand's quality/trust pillars (Pure Ingredients, Refreshing Taste,
  Quality You Can Trust, Healthier Choices).
- FR-1.1.4: Provide a call-to-action leading to the Request page.
- FR-1.1.5: Must work smoothly on both desktop and mobile (reduced-motion fallback for
  low-power devices).

### 1.2 Flavours Pages
- FR-1.2.1: List all 8 flavours in a grid, filterable by collection (Classic Favourites /
  Exotic & Regional).
- FR-1.2.2: Each flavour links to its own detail page showing full description, available
  sizes, and a "Request this flavour" call-to-action.
- FR-1.2.3: Detail page CTA pre-fills the flavour field on the Request form.

### 1.3 About Page
- FR-1.3.1: Display brand story content sourced from the catalogue.
- FR-1.3.2: Display quality standards (FSSAI-compliant, tamper-evident caps, batch-checked,
  consistent recipe, storage/best-enjoyed guidance).
- FR-1.3.3: Display distribution reach (list/map of cities served).

### 1.4 Contact Page
- FR-1.4.1: Display contact details (phone, email, address) — placeholder until client
  provides real data.
- FR-1.4.2: Provide a general inquiry form (name, email, message) that emails the owner.

### 1.5 Request Page
- FR-1.5.1: Provide a form with: name, email, phone, flavour(s), size, quantity, city,
  optional message.
- FR-1.5.2: No login/account required to submit a request.
- FR-1.5.3: On submit, save the request to the database and send an email notification to
  the business owner.
- FR-1.5.4: Show a confirmation message after submission.
- FR-1.5.5: (Optional, recommended) Send the customer a confirmation email, optionally
  containing a private status-check link (no login).
- FR-1.5.6: Must include spam protection (honeypot field + IP rate limiting).

### 1.6 Admin Dashboard
- FR-1.6.1: Single admin login (username/password), no self-service signup.
- FR-1.6.2: List all submitted requests with filter/sort by status and date.
- FR-1.6.3: View full detail of a single request.
- FR-1.6.4: Update a request's status: New / Contacted / Closed.
- FR-1.6.5: Protected — inaccessible without valid admin session (JWT).

## 2. Non-Functional Requirements
- NFR-1: Fully responsive — mobile, tablet, desktop.
- NFR-2: Landing page animation must not drop below acceptable frame rate on mid-range
  mobile devices; provide `prefers-reduced-motion` fallback.
- NFR-3: Page load performance — Lighthouse performance score target 80+ on mobile.
- NFR-4: All forms must validate input client-side and server-side.
- NFR-5: No sensitive data (admin password, DB credentials, SMTP credentials) committed to
  the repository — use environment variables.
- NFR-6: Free-tier hosting must be sufficient for expected traffic (10-50 requests/min).

## 3. Explicit Exclusions
- No payment processing.
- No customer accounts, login, or order history/tracking.
- No inventory or stock management.
- No multi-language support in v1.
- No content-management system — flavour and page content is static in code.

## 4. Assumptions
- Client will provide real contact details, logo assets, and (ideally) product photography
  before launch; placeholders are used until then.
- Traffic volume in year 1 is low enough for free-tier hosting/DB to be sufficient.
- The business process for handling a "request" (calling/emailing the customer) happens
  entirely outside the website.
