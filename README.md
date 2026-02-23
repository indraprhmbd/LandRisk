# LandRisk — Land Feasibility Risk Evaluation

A structured spatial intelligence layer for early-stage land feasibility decisions. Quantify uncertainty with architectural precision.

## 🌐 Live Demo

[Insert Vercel deployment URL]

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js App (Vercel)                                       │
│  - Frontend UI (Dashboard, Map, Reports)                    │
│  - Deterministic Risk Engine                                │
│  - Confidence Engine                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP POST /interpret
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  FastAPI AI Service (HuggingFace Spaces)                    │
│  - LLM Integration (Gemini 2.0 / GPT-4o)                    │
│  - Structured Interpretation                                │
│  - Deterministic Fallback                                   │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **Deterministic Risk Engine**: Composite risk scoring from 5 weighted factors
  - Soil Stability (35%)
  - Flood Exposure (25%)
  - Environmental Sensitivity (15%)
  - Zoning Compliance (15%)
  - Topography (10%)

- **Confidence Scoring**: Data reliability metrics
  - Data Completeness (50%)
  - Model Consistency (30%)
  - Data Recency (20%)

- **AI Interpretation**: LLM-generated analytical summaries
- **Interactive Map**: Leaflet-based spatial visualization
- **Dashboard**: Filterable parcel overview with risk classification

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon/Supabase) |
| ORM | Prisma |
| Map | Leaflet + react-leaflet |
| Charts | Recharts |
| AI Service | FastAPI (Python) |
| LLM | Gemini 2.0 Flash / GPT-4o |
| Hosting | Vercel + HuggingFace Spaces |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud)
- Python 3.10+ (for AI service)
- API keys for LLM (optional)

### 1. Clone & Install

```bash
git clone <repository-url>
cd LandRisk
npm install
```

### 2. Environment Setup

Create `.env` in the project root:

```env
# Database (replace with your PostgreSQL URL)
DATABASE_URL="postgresql://user:password@localhost:5432/landrisk"

# AI Service
AI_ENDPOINT_URL="http://127.0.0.1:7860"
AI_API_KEY=""
MODEL_VERSION="LR-Engine-v1.0"
```

### 3. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed database with 50 Indonesian parcels
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. (Optional) Run AI Service Locally

```bash
cd AI
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your LLM API keys
python main.py
```

## AI Service Setup

See [AI/README.md](AI/README.md) for detailed FastAPI service documentation.

### Quick Start

1. Get API keys:
   - [Google AI Studio](https://aistudio.google.com/apikey) for Gemini
   - [OpenAI Platform](https://platform.openai.com/api-keys) for GPT-4o

2. Configure `AI/.env`:
   ```env
   GEMINI_API_KEY=your-gemini-key
   OPENAI_API_KEY=your-openai-key
   AI_MODEL_PROVIDER=gemini
   ```

3. Deploy to HuggingFace Spaces:
   - Create new Space (Docker template)
   - Upload `AI/` contents
   - Set environment variables
   - Update `AI_ENDPOINT_URL` in main `.env`

## Project Structure

```
LandRisk/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Parcel dashboard
│   │   ├── map/          # Map visualization
│   │   └── report/       # Risk report pages
│   ├── components/       # React components
│   ├── lib/              # Utilities (DB, AI client)
│   └── services/         # Business logic
│       ├── business/
│       │   ├── risk.ts       # Risk engine
│       │   └── confidence.ts # Confidence engine
├── AI/                 # FastAPI AI service
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env               # Environment variables
└── package.json
```

## API Endpoints

### Next.js API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/evaluate` | POST | Evaluate coordinates, return risk + interpretation |
| `/api/parcels` | GET | List all parcels with computed risk |
| `/api/parcels/[id]` | GET | Get single parcel with full report |

### AI Service Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/interpret` | POST | Generate AI interpretation |

## Risk Classification

| Score Range | Classification |
|-------------|----------------|
| 0–39 | Low Risk |
| 40–69 | Moderate Risk |
| 70–100 | High Risk |

## Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Deployment

### Next.js (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL`
   - `AI_ENDPOINT_URL` (your HF Spaces URL)
4. Deploy

### AI Service (HuggingFace Spaces)

1. Create Space with Docker template
2. Upload `AI/` directory contents
3. Set environment variables
4. Update `AI_ENDPOINT_URL` in Vercel

## Sample Data

The database is seeded with 50 Indonesian land parcels across:
- Industrial zones (Cikarang, Karawang, Bekasi)
- Commercial areas (Jakarta, Surabaya, Bali)
- Residential developments (Bogor, Bandung, Makassar)
- Tourism zones (Bali, Lombok, Labuan Bajo)
- Mixed-use (PIK 2, Nusantara IKN)

## Limitations

- **Hackathon Data**: Seeded data is for demonstration only
- **Not for Investment**: Do not use for actual capital decisions
- **No Real-time GIS**: Static dataset, no live updates
- **AI Fallback**: Uses deterministic interpretation if LLM unavailable

## Future Enhancements

- Real GIS data ingestion pipeline
- Redis caching for risk calculations
- Historical trend tracking
- Portfolio-level analytics
- Multi-tenant authentication
- Export functionality (PDF, CSV)

## License

MIT
