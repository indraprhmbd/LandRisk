from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LandRisk AI Engine",
    description="AI Interpretation Layer for Land Risk Analysis",
    version="1.0.0"
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

# --- Logic ---

@app.get("/")
def read_root():
    return {"status": "ok", "service": "LandRisk AI Engine"}

@app.post("/interpret", response_model=InterpretationOutput)
async def interpret_risk(request: InterpretRequest):
    """
    Generates a risk interpretation based on deterministic engine outputs.
    This is a mocked AI endpoint for now, but ready for LLM integration.
    """
    try:
        data = request
        risk_class = data.engine_output.classification
        score = data.engine_output.risk_score
        dominant = data.engine_output.dominant_factor
        location = data.parcel_metadata.location_name
        zoning = data.parcel_metadata.zoning_category
        
        # Deterministic generation logic (mimicking AI for now)
        summary = (
            f"Parcel in {location} presents a {risk_class} risk profile (Score: {score:.1f}/100). "
            f"The primary driver of risk is {dominant}, which significantly impacts feasibility "
            f"for {zoning} development."
        )

        observations = [
            f"{dominant} contributes most significantly to the risk profile.",
            f"Overall confidence in this assessment is {data.confidence_output.confidence_score * 100:.0f}%.",
            f"Zoning compatibility for {zoning} requires careful validation against local regulations."
        ]

        if risk_class == "High":
            recommendation = "Proceed with extreme caution. Detailed geotechnical and hydrological studies are mandatory before acquisition."
        elif risk_class == "Moderate":
            recommendation = "Proceed with caution. Mitigating factors for dominant risks should be factored into the development cost model."
        else:
            recommendation = "Favorable conditions for development. Standard due diligence is recommended."

        limitations = "Analysis based on available remote sensing data. On-site verification is required."

        return InterpretationOutput(
            summary=summary,
            key_observations=observations,
            recommended_action=recommendation,
            limitations=limitations
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
