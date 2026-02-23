from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import uvicorn
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize LLM clients
try:
    from huggingface_hub import InferenceClient
    HF_AVAILABLE = True
    hf_client = InferenceClient(token=os.getenv("HF_API_KEY", "")) if os.getenv("HF_API_KEY") else None
except ImportError:
    HF_AVAILABLE = False
    hf_client = None

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
    openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
except ImportError:
    OPENAI_AVAILABLE = False

app = FastAPI(
    title="LandRisk AI Engine",
    description="AI Interpretation Layer for Land Risk Analysis",
    version="2.0.0"
)

# --- Pydantic Models ---

class RiskFactor(BaseModel):
    factor: str
    raw_value: float
    weight: float
    weighted_value: float

class EngineOutput(BaseModel):
    risk_score: float
    classification: str
    dominant_factor: str
    factor_breakdown: List[RiskFactor]
    model_version: str

class ConfidenceOutput(BaseModel):
    confidence_score: float
    completeness_score: float
    consistency_score: float
    recency_score: float
    low_integrity: bool

class ParcelMetadata(BaseModel):
    location_name: str
    coordinates: str
    land_area: float
    zoning_category: str

class InterpretRequest(BaseModel):
    engine_output: EngineOutput
    confidence_output: ConfidenceOutput
    parcel_metadata: ParcelMetadata

class InterpretationOutput(BaseModel):
    summary: str
    key_observations: List[str]
    recommended_action: str
    limitations: str

# --- Build Prompt ---

def build_prompt(request: InterpretRequest) -> str:
    """Build the prompt for LLM."""
    factors_text = "\n".join([
        f"- {f.factor}: {f.raw_value}/100 (weight: {f.weight*100:.0f}%) → {f.weighted_value:.1f}"
        for f in request.engine_output.factor_breakdown
    ])
    
    prompt = f"""You are an analytical assistant for LandRisk, a land feasibility risk evaluation system.
Generate a structured risk interpretation based on the following data:

**Parcel Information:**
- Location: {request.parcel_metadata.location_name}
- Coordinates: {request.parcel_metadata.coordinates}
- Land Area: {request.parcel_metadata.land_area} m²
- Zoning: {request.parcel_metadata.zoning_category}

**Risk Assessment:**
- Risk Score: {request.engine_output.risk_score}/100 ({request.engine_output.classification} Risk)
- Dominant Factor: {request.engine_output.dominant_factor}
- Model Version: {request.engine_output.model_version}

**Factor Breakdown:**
{factors_text}

**Confidence Metrics:**
- Overall Confidence: {request.confidence_output.confidence_score*100:.0f}%
- Data Completeness: {request.confidence_output.completeness_score*100:.0f}%
- Model Consistency: {request.confidence_output.consistency_score*100:.0f}%
- Data Recency: {request.confidence_output.recency_score*100:.0f}%

Generate a response in this exact JSON format:
{{
    "summary": "3-5 sentence analytical summary highlighting the dominant risk factor and classification",
    "key_observations": ["observation 1", "observation 2", "observation 3"],
    "recommended_action": "conservative, realistic recommendation based on risk level",
    "limitations": "mention data limitations if confidence is low, always include 'Interpretation generated from structured engine output.'"
}}

Tone: Analytical, conservative, professional. Do not invent data or claim professional authority."""
    
    return prompt

# --- AI Interpretation Logic ---

async def call_qwen(request: InterpretRequest) -> InterpretationOutput:
    """Call Qwen via HuggingFace Inference API."""
    try:
        if not hf_client:
            raise Exception("HuggingFace client not initialized")
        
        model = os.getenv("HF_MODEL_ID", "Qwen/Qwen2.5-72B-Instruct")
        prompt = build_prompt(request)
        
        response = hf_client.chat_completion(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an analytical assistant for LandRisk. Generate structured risk interpretations in JSON format. Be analytical, conservative, and professional."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=500,
            temperature=0.3
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Handle markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        data = json.loads(response_text.strip())
        
        return InterpretationOutput(
            summary=data.get("summary", ""),
            key_observations=data.get("key_observations", []),
            recommended_action=data.get("recommended_action", ""),
            limitations=data.get("limitations", "")
        )
    except Exception as e:
        raise Exception(f"Qwen API error: {str(e)}")


async def call_gemini(request: InterpretRequest) -> InterpretationOutput:
    """Call Gemini API for interpretation."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        prompt = build_prompt(request)
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Handle markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        data = json.loads(response_text.strip())
        
        return InterpretationOutput(
            summary=data.get("summary", ""),
            key_observations=data.get("key_observations", []),
            recommended_action=data.get("recommended_action", ""),
            limitations=data.get("limitations", "")
        )
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


async def call_openai(request: InterpretRequest) -> InterpretationOutput:
    """Call OpenAI API for interpretation (fallback)."""
    try:
        prompt = build_prompt(request)
        
        response = await openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an analytical assistant for LandRisk. Generate structured risk interpretations in JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        data = json.loads(response.choices[0].message.content)
        
        return InterpretationOutput(
            summary=data.get("summary", ""),
            key_observations=data.get("key_observations", []),
            recommended_action=data.get("recommended_action", ""),
            limitations=data.get("limitations", "")
        )
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


def generate_fallback_interpretation(request: InterpretRequest) -> InterpretationOutput:
    """Deterministic fallback when LLM is unavailable."""
    risk_class = request.engine_output.classification
    score = request.engine_output.risk_score
    dominant = request.engine_output.dominant_factor
    location = request.parcel_metadata.location_name
    zoning = request.parcel_metadata.zoning_category
    confidence_percent = int(request.confidence_output.confidence_score * 100)

    sorted_factors = sorted(
        request.engine_output.factor_breakdown,
        key=lambda x: x.weighted_value,
        reverse=True
    )

    summary = (
        f"The parcel at {location} ({request.parcel_metadata.coordinates}) has been evaluated "
        f"with a composite risk score of {score:.1f}/100, classified as {risk_class} Risk. "
        f"The dominant risk contributor is {dominant}, which accounts for a weighted value of "
        f"{sorted_factors[0].weighted_value:.1f} out of the total score. The assessment carries "
        f"a confidence level of {confidence_percent}%, derived from data completeness, model "
        f"consistency, and data recency metrics."
    )

    observations = [
        f"{f.factor}: Raw value {f.raw_value:.1f}/100 (weight: {f.weight*100:.0f}%) contributing {f.weighted_value:.1f} to composite score."
        for f in sorted_factors
    ]

    if request.confidence_output.low_integrity:
        observations.append(
            "Data completeness is below 60% threshold — results should be treated with caution."
        )

    if risk_class == "High":
        second_factor = sorted_factors[1].factor if len(sorted_factors) > 1 else "environmental conditions"
        recommendation = (
            f"High risk detected primarily from {dominant}. Recommend conducting a comprehensive "
            f"geotechnical survey and {second_factor.lower()} assessment before proceeding with "
            f"any capital allocation."
        )
    elif risk_class == "Moderate":
        recommendation = (
            f"Moderate risk profile driven by {dominant}. Recommend targeted investigation of "
            f"{dominant.lower()} conditions and verification of {zoning} zoning compliance "
            f"before commitment."
        )
    else:
        recommendation = (
            f"Low risk profile. Standard due diligence recommended, with particular attention to "
            f"{dominant.lower()} verification and zoning regulatory confirmation."
        )

    limitations_parts = [
        "Interpretation generated from structured engine output.",
    ]

    if request.confidence_output.low_integrity:
        limitations_parts.append(
            "Data completeness is below acceptable threshold (60%). Findings are preliminary and require field verification."
        )

    limitations_parts.append(
        "Risk indices are based on seeded hackathon data and should not be used for actual investment decisions."
    )
    limitations_parts.append(f"Confidence: {confidence_percent}%.")

    return InterpretationOutput(
        summary=summary,
        key_observations=observations,
        recommended_action=recommendation,
        limitations=" ".join(limitations_parts)
    )


# --- API Endpoints ---

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "LandRisk AI Engine",
        "version": "2.0.0",
        "models": {
            "qwen": {
                "available": HF_AVAILABLE,
                "configured": bool(os.getenv("HF_API_KEY")),
                "model_id": os.getenv("HF_MODEL_ID", "Qwen/Qwen2.5-72B-Instruct")
            },
            "gemini": {
                "available": GEMINI_AVAILABLE,
                "configured": bool(os.getenv("GEMINI_API_KEY"))
            },
            "openai": {
                "available": OPENAI_AVAILABLE,
                "configured": bool(os.getenv("OPENAI_API_KEY"))
            }
        }
    }


@app.post("/interpret", response_model=InterpretationOutput)
async def interpret_risk(request: InterpretRequest):
    """
    Generates a risk interpretation using LLM (Qwen/Gemini/OpenAI) or deterministic fallback.

    Priority:
    1. Qwen 2.5 72B (via HuggingFace Inference API)
    2. Gemini 2.0 Flash
    3. OpenAI GPT-4o
    4. Deterministic fallback
    """
    provider = os.getenv("AI_MODEL_PROVIDER", "qwen")

    # Try configured provider first
    try:
        if provider == "qwen" and HF_AVAILABLE and hf_client:
            return await call_qwen(request)
        elif provider == "gemini" and GEMINI_AVAILABLE and os.getenv("GEMINI_API_KEY"):
            return await call_gemini(request)
        elif provider == "openai" and OPENAI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
            return await call_openai(request)
    except Exception as e:
        print(f"LLM call failed ({provider}): {e}")

    # Try fallback providers in order
    try:
        if HF_AVAILABLE and hf_client:
            return await call_qwen(request)
    except Exception as e:
        print(f"Qwen fallback failed: {e}")
    
    try:
        if GEMINI_AVAILABLE and os.getenv("GEMINI_API_KEY"):
            return await call_gemini(request)
    except Exception as e:
        print(f"Gemini fallback failed: {e}")
    
    try:
        if OPENAI_AVAILABLE and os.getenv("OPENAI_API_KEY"):
            return await call_openai(request)
    except Exception as e:
        print(f"OpenAI fallback failed: {e}")

    # Use deterministic fallback
    return generate_fallback_interpretation(request)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 7860))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
