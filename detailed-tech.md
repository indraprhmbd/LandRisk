# LandRisk — Detailed Technical Stack (Hackathon Scope)

Status: Hackathon Implementation
Philosophy: Deterministic-First | Scalable by Design | Minimal Overhead

---

# 1. HIGH-LEVEL ARCHITECTURE

Frontend (Next.js on Vercel)
↓
Next.js API Routes (Risk Engine)
↓
PostgreSQL (Seeded Parcel Data)
↓
External AI Layer (FastAPI on HuggingFace)

AI layer only interprets structured engine output.
Deterministic engine is single source of truth.

---

# 2. FRONTEND

Framework:

- Next.js 14+ (App Router, stable)
- React 18+
- TypeScript

Hosting:

- Vercel

State Management:

- React Server Components for data fetch
- Minimal client state (useState)
- No Redux

Styling:

- Tailwind CSS
- Design tokens predefined
- No component overengineering

Map:

- Mapbox GL JS (lightweight implementation)
  OR
- Simple static tile embed (for hackathon stability)

Pages:

/dashboard
/report/[parcelId]
/map

Responsibilities:

- Input coordinates
- Display risk summary
- Display breakdown
- Display confidence
- Display AI interpretation

No heavy GIS rendering logic in frontend.

---

# 3. BACKEND (Next.js API Routes)

Location:
app/api/evaluate/route.ts

Responsibilities:

1. Receive coordinate input
2. Snap to nearest parcel (simple SQL query)
3. Fetch parcel data
4. Run deterministic risk formula
5. Run confidence formula
6. Call AI FastAPI endpoint
7. Merge result
8. Return structured JSON

No background jobs.
No queue.
No microservices.

---

# 4. DATABASE

Database:
PostgreSQL 15+

Hosting options:

- Supabase (recommended for hackathon speed)
  OR
- Neon.tech

ORM:

- Prisma (latest stable)

Schema (Simplified):

model Parcel {
id String @id @default(uuid())
location_name String
latitude Float
longitude Float
land_area Float
zoning_category String

soil_index Float
flood_index Float
environmental_index Float
zoning_index Float
topography_index Float

data_completeness Float
model_consistency Float
data_recency Float

last_updated DateTime
data_source_label String

created_at DateTime @default(now())
}

Seed:
50–100 parcels for demo stability.

No dynamic ingestion for hackathon.

---

# 5. DETERMINISTIC RISK ENGINE

Implemented inside API route.

Formula:

risk_score =
(soil_index × 0.35) +
(flood_index × 0.25) +
(environmental_index × 0.15) +
(zoning_index × 0.15) +
(topography_index × 0.10)

Classification:
0–39 → Low
40–69 → Moderate
70–100 → High

Dominant factor:
Highest weighted contribution.

All weights hardcoded for hackathon.

---

# 6. CONFIDENCE ENGINE

confidence =
(data_completeness × 0.5) +
(model_consistency × 0.3) +
(data_recency × 0.2)

Return as percentage.

If data_completeness < 0.6:
flag: low_integrity = true

---

# 7. AI LAYER

Framework:

- FastAPI
- Python 3.11+
- Hosted on HuggingFace Spaces (CPU)

Endpoint:
POST /interpret

Input:
{
engine_output,
confidence_output,
parcel_metadata
}

AI Responsibilities:

- Generate structured summary
- Highlight dominant risk
- Provide conservative recommendation
- Mention confidence context

AI does NOT:

- Access DB
- Recalculate scores
- Change values

Model:
Gemini 3 Pro via server API
OR
OpenAI GPT-4o (fallback)

---

# 8. DATA FLOW

User → Frontend
Frontend → /api/evaluate
API:

- Fetch parcel
- Compute risk
- Compute confidence
- Call HF AI
- Merge result
  Return JSON
  Frontend render

---

# 9. ENVIRONMENT VARIABLES

Frontend / Backend:

DATABASE_URL=
AI_ENDPOINT_URL=
AI_API_KEY=
MODEL_VERSION=LR-Engine-v1.0

---

# 10. DEPLOYMENT STRATEGY

Frontend + API:
Vercel

Database:
Supabase / Neon

AI:
HuggingFace Spaces (FastAPI)

Zero VPS needed.
No Docker required for hackathon.

---

# 11. WHAT WE ARE NOT BUILDING (INTENTIONALLY)

- Real GIS ingestion pipeline
- Real-time flood data API
- Multi-tenant auth system
- Stripe billing
- Portfolio analytics
- Background job queue
- Websocket streaming
- Model auto-training

Keep it tight.
Keep it demo-stable.

---

# 12. SCALABILITY PATH (POST-HACKATHON)

Future improvements:

- Move deterministic engine into dedicated Go service
- Add Redis caching
- Introduce job queue (BullMQ)
- Real GIS ingestion pipeline
- Model versioning table
- Portfolio-level analytics
- Enterprise auth

But NOT in hackathon.

---

# 13. SYSTEM PRINCIPLES

1. Deterministic first.
2. AI only interprets.
3. Confidence is computed, not guessed.
4. All outputs reproducible.
5. Keep infra minimal.

---

End of Technical Stack.
