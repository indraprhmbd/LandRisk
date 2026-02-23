# LandRisk AI Engine - Qwen Edition

FastAPI-based AI interpretation layer for LandRisk land feasibility analysis, now with **Qwen 2.5 72B** support via HuggingFace Inference API.

## Features

- ✅ **Qwen 2.5 72B** support (Free via HuggingFace Inference API)
- ✅ Gemini 2.0 Flash support
- ✅ OpenAI GPT-4o support
- ✅ Deterministic fallback (always available)
- ✅ Ready for HuggingFace Spaces deployment
- ✅ JSON-structured responses

## Quick Start

### 1. Install Dependencies

```bash
cd AI
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` file:

```env
# HuggingFace API (Required for Qwen)
HF_API_KEY=your_huggingface_token_here
HF_MODEL_ID=Qwen/Qwen2.5-72B-Instruct

# Model Provider
AI_MODEL_PROVIDER=qwen

# Optional: Other LLMs
GEMINI_API_KEY=
OPENAI_API_KEY=

# Server
PORT=7860
```

**Get HuggingFace Token:**
1. Go to https://huggingface.co/settings/tokens
2. Click "Create new token"
3. Choose "Read" permission
4. Copy and paste to `.env`

### 3. Run Locally

```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 7860
```

Visit: http://localhost:7860

### 4. Test the API

```bash
curl -X POST http://localhost:7860/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "engine_output": {
      "risk_score": 45.4,
      "classification": "Moderate",
      "dominant_factor": "Soil Stability",
      "factor_breakdown": [],
      "model_version": "LR-Engine-v1.0"
    },
    "confidence_output": {
      "confidence_score": 0.914,
      "completeness_score": 0.92,
      "consistency_score": 0.88,
      "recency_score": 0.95,
      "low_integrity": false
    },
    "parcel_metadata": {
      "location_name": "Test Location",
      "coordinates": "-6.307, 107.161",
      "land_area": 2500,
      "zoning_category": "Industrial"
    }
  }'
```

---

## Deploy to HuggingFace Spaces

### Step 1: Create Space

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Choose **Docker** as SDK
4. Name: `landrisk-ai-engine`
5. Visibility: Public or Private

### Step 2: Upload Files

Upload all files from this `AI/` directory:
- `main.py`
- `requirements.txt`
- `Dockerfile`
- `.dockerignore`
- `.env` (or set secrets in Space settings)

### Step 3: Configure Secrets

In your Space settings → **Repository secrets**, add:
- `HF_API_KEY` - Your HuggingFace token
- `HF_MODEL_ID` - `Qwen/Qwen2.5-72B-Instruct`
- `AI_MODEL_PROVIDER` - `qwen`

### Step 4: Deploy

The Space will automatically build and deploy. Once ready, you'll get a URL like:
```
https://huggingface.co/spaces/your-username/landrisk-ai-engine
```

---

## API Endpoints

### GET `/`
Health check and model status.

**Response:**
```json
{
  "status": "ok",
  "service": "LandRisk AI Engine",
  "version": "2.0.0",
  "models": {
    "qwen": {
      "available": true,
      "configured": true,
      "model_id": "Qwen/Qwen2.5-72B-Instruct"
    },
    "gemini": { ... },
    "openai": { ... }
  }
}
```

### POST `/interpret`
Generate AI interpretation for risk assessment.

**Request Body:**
```json
{
  "engine_output": {
    "risk_score": 45.4,
    "classification": "Moderate",
    "dominant_factor": "Soil Stability",
    "factor_breakdown": [
      {
        "factor": "Soil Stability",
        "raw_value": 62,
        "weight": 0.35,
        "weighted_value": 21.7
      }
    ],
    "model_version": "LR-Engine-v1.0"
  },
  "confidence_output": {
    "confidence_score": 0.914,
    "completeness_score": 0.92,
    "consistency_score": 0.88,
    "recency_score": 0.95,
    "low_integrity": false
  },
  "parcel_metadata": {
    "location_name": "Cikarang Industrial Zone",
    "coordinates": "-6.307, 107.161",
    "land_area": 2500,
    "zoning_category": "Industrial"
  }
}
```

**Response:**
```json
{
  "summary": "The parcel at Cikarang Industrial Zone...",
  "key_observations": [
    "Soil Stability: Raw value 62.0/100...",
    "Flood Exposure: Raw value 45.0/100..."
  ],
  "recommended_action": "Moderate risk profile driven by Soil Stability...",
  "limitations": "Interpretation generated from structured engine output..."
}
```

---

## Model Comparison

| Model | Provider | Free Tier | Rate Limit | Quality | Best For |
|-------|----------|-----------|------------|---------|----------|
| **Qwen 2.5 72B** | HuggingFace | ✅ Yes | 100 req/day | ⭐⭐⭐⭐⭐ | Production (free) |
| **Gemini 2.0 Flash** | Google | ✅ Yes | 15 req/min | ⭐⭐⭐⭐ | Fast responses |
| **GPT-4o** | OpenAI | ❌ Paid | - | ⭐⭐⭐⭐⭐ | Highest quality |
| **Deterministic** | Local | ✅ Always | Unlimited | ⭐⭐⭐ | Fallback |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HF_API_KEY` | ✅ (for Qwen) | - | HuggingFace API token |
| `HF_MODEL_ID` | ❌ | `Qwen/Qwen2.5-72B-Instruct` | Qwen model ID |
| `AI_MODEL_PROVIDER` | ❌ | `qwen` | Primary model: `qwen`, `gemini`, or `openai` |
| `GEMINI_API_KEY` | ❌ | - | Google AI Studio API key |
| `OPENAI_API_KEY` | ❌ | - | OpenAI API key |
| `PORT` | ❌ | `7860` | Server port |

---

## Troubleshooting

### "HuggingFace client not initialized"
- Make sure `HF_API_KEY` is set in `.env`
- Check if `huggingface_hub` is installed: `pip install huggingface_hub`

### "Rate limit exceeded"
- HuggingFace free tier: 100 requests/day
- Upgrade to HuggingFace Pro for higher limits
- Or switch to Gemini/OpenAI

### "Model not found"
- Check `HF_MODEL_ID` is correct
- Default: `Qwen/Qwen2.5-72B-Instruct`

---

## License

MIT
