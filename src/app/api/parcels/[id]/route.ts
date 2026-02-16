import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateRisk } from "@/services/business/risk";
import { calculateConfidence } from "@/services/business/confidence";
import { getInterpretation } from "@/lib/ai/interpret";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const parcel = await prisma.parcel.findUnique({
      where: { id },
    });

    if (!parcel) {
      return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
    }

    const engineOutput = calculateRisk({
      soil_index: parcel.soil_index,
      flood_index: parcel.flood_index,
      environmental_index: parcel.environmental_index,
      zoning_index: parcel.zoning_index,
      topography_index: parcel.topography_index,
    });

    const confidenceOutput = calculateConfidence({
      data_completeness: parcel.data_completeness,
      model_consistency: parcel.model_consistency,
      data_recency: parcel.data_recency,
    });

    const interpretation = await getInterpretation({
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      parcel_metadata: {
        location_name: parcel.location_name,
        coordinates: `${parcel.latitude}, ${parcel.longitude}`,
        land_area: parcel.land_area,
        zoning_category: parcel.zoning_category,
      },
    });

    return NextResponse.json({
      location_summary: {
        location_name: parcel.location_name,
        coordinates: `${parcel.latitude}, ${parcel.longitude}`,
        land_area: parcel.land_area,
        zoning_category: parcel.zoning_category,
        parcel_id: parcel.id,
      },
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      interpretation,
      metadata: {
        data_source: parcel.data_source_label,
        last_updated: parcel.last_updated,
      },
    });
  } catch (error) {
    console.error("Parcel detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
