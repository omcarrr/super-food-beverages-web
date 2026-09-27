# Super Foods & Beverages — Website

Marketing + lead-generation website for Super Foods & Beverages ("Har Boond Mein Taazgi").
See `/docs` for full planning documents:

- [PLAN.md](docs/PLAN.md) — scope, milestones, branching strategy
- [REQUIREMENTS.md](docs/REQUIREMENTS.md) — functional & non-functional requirements
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — folder structure, system design
- [API.md](docs/API.md) — backend route reference
- [DATA-MODEL.md](docs/DATA-MODEL.md) — DB schemas + static content

## Quick Start

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free M0 cluster)
- A Gmail account with an App Password generated (for SMTP)

### Frontend
```bash
cd frontend
cp .env.example .env      # fill in VITE_API_BASE_URL
npm install
npm run dev                # runs at localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env      # fill in Mongo URI, JWT secret, Gmail credentials
npm install
npm run dev                # runs at localhost:5000
```

### Seed the admin user
```bash
cd backend
npm run seed:admin -- --username=admin --password=<choose-a-strong-password>
```

## Deployment
- **Frontend** → Vercel, connect the `frontend` folder as the project root, set
  `VITE_API_BASE_URL` in Vercel's environment variables.
- **Backend** → Render, connect the `backend` folder as the project root, set all variables
  from `backend/.env.example` in Render's environment variables dashboard.
- **Database** → MongoDB Atlas, whitelist Render's outbound IP (or `0.0.0.0/0` for
  simplicity at this scale), create separate databases for staging/production if desired.

## Branching
See PLAN.md §7. Short version: `main` = production, `dev` = staging, feature branches for
everything else, merged via PR.
