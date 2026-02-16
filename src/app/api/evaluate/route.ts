import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateRisk } from "@/services/business/risk";
import { calculateConfidence } from "@/services/business/confidence";
import { getInterpretation } from "@/lib/ai/interpret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing latitude or longitude" },
        { status: 400 },
      );
    }

    // Snap to nearest parcel using Euclidean distance approximation
    const parcels = await prisma.parcel.findMany();

    if (parcels.length === 0) {
      return NextResponse.json(
        { error: "No parcels available in database" },
        { status: 404 },
      );
    }

    // Find nearest parcel
    let nearest = parcels[0];
    let minDist = Infinity;

    for (const parcel of parcels) {
      const dist = Math.sqrt(
        Math.pow(parcel.latitude - latitude, 2) +
          Math.pow(parcel.longitude - longitude, 2),
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = parcel;
      }
    }

    // Run deterministic risk engine
    const engineOutput = calculateRisk({
      soil_index: nearest.soil_index,
      flood_index: nearest.flood_index,
      environmental_index: nearest.environmental_index,
      zoning_index: nearest.zoning_index,
      topography_index: nearest.topography_index,
    });

    // Run confidence engine
    const confidenceOutput = calculateConfidence({
      data_completeness: nearest.data_completeness,
      model_consistency: nearest.model_consistency,
      data_recency: nearest.data_recency,
    });

    // Get AI interpretation
    const interpretation = await getInterpretation({
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      parcel_metadata: {
        location_name: nearest.location_name,
        coordinates: `${nearest.latitude}, ${nearest.longitude}`,
        land_area: nearest.land_area,
        zoning_category: nearest.zoning_category,
      },
    });

    // Return structured JSON per output contract
    return NextResponse.json({
      location_summary: {
        location_name: nearest.location_name,
        coordinates: `${nearest.latitude}, ${nearest.longitude}`,
        land_area: nearest.land_area,
        zoning_category: nearest.zoning_category,
        parcel_id: nearest.id,
      },
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      interpretation,
      metadata: {
        snapped_distance_deg: Math.round(minDist * 10000) / 10000,
        data_source: nearest.data_source_label,
        last_updated: nearest.last_updated,
      },
    });
  } catch (error) {
    console.error("Evaluate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
