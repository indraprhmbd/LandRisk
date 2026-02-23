import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateRisk } from "@/services/business/risk";
import { calculateConfidence } from "@/services/business/confidence";
import { getInterpretation } from "@/lib/ai/interpret";
import { fetchExternalAPIData } from "@/services/external";
import { getCachedParcel, cacheParcelData } from "@/services/cache";
import { getDataSourceQualityScore } from "@/services/external";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, userId } = body;

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing latitude or longitude" },
        { status: 400 }
      );
    }

    // 1. Check cache first (within 500m tolerance)
    const cachedParcel = await getCachedParcel(latitude, longitude, 0.5);

    if (cachedParcel && !cachedParcel.is_offline_mode) {
      // Return cached data if still fresh
      const engineOutput = calculateRisk({
        soil_index: cachedParcel.soil_index,
        flood_index: cachedParcel.flood_index,
        environmental_index: cachedParcel.environmental_index,
        zoning_index: cachedParcel.zoning_index,
        topography_index: cachedParcel.topography_index,
      });

      const confidenceOutput = calculateConfidence({
        data_completeness: cachedParcel.data_completeness,
        model_consistency: cachedParcel.model_consistency,
        data_recency: cachedParcel.data_recency,
      });

      const interpretation = await getInterpretation({
        engine_output: engineOutput,
        confidence_output: confidenceOutput,
        parcel_metadata: {
          location_name: cachedParcel.location_name,
          coordinates: `${cachedParcel.latitude}, ${cachedParcel.longitude}`,
          land_area: cachedParcel.land_area,
          zoning_category: cachedParcel.zoning_category,
        },
      });

      return NextResponse.json({
        location_summary: {
          location_name: cachedParcel.location_name,
          coordinates: `${cachedParcel.latitude}, ${cachedParcel.longitude}`,
          land_area: cachedParcel.land_area,
          zoning_category: cachedParcel.zoning_category,
          parcel_id: cachedParcel.id,
        },
        engine_output: engineOutput,
        confidence_output: confidenceOutput,
        interpretation,
        metadata: {
          source: "cache",
          data_sources: cachedParcel.data_source_label.split(", "),
          is_offline: false,
          cached: true,
          cached_at: cachedParcel.api_cache_timestamp,
        },
      });
    }

    // 2. Fetch from external APIs
    const externalData = await fetchExternalAPIData(latitude, longitude);

    // 3. Calculate risk using engine
    const engineOutput = calculateRisk({
      soil_index: externalData.soil_index,
      flood_index: externalData.flood_index,
      environmental_index: externalData.environmental_index,
      zoning_index: externalData.zoning_index,
      topography_index: externalData.topography_index,
    });

    // 4. Calculate confidence (adjusted for offline mode)
    const dataQualityScore = getDataSourceQualityScore(
      externalData.sources,
      externalData.is_offline
    );

    const confidenceOutput = calculateConfidence({
      data_completeness: externalData.is_offline ? 0.5 : 0.9 * dataQualityScore,
      model_consistency: 0.8,
      data_recency: 1.0,
    });

    // 5. Cache the result
    const locationName = `Location ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    const parcel = await cacheParcelData(
      latitude,
      longitude,
      { ...externalData, ...engineOutput },
      locationName,
      userId
    );

    // 6. Get AI interpretation
    const interpretation = await getInterpretation({
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      parcel_metadata: {
        location_name: locationName,
        coordinates: `${latitude}, ${longitude}`,
        land_area: 1000,
        zoning_category: "Unknown",
      },
    });

    // Add offline context to interpretation
    if (externalData.is_offline) {
      interpretation.limitations +=
        " Note: Some data sources were unavailable. Analysis based on limited data. Consider verifying with on-site assessment.";
    }

    return NextResponse.json({
      location_summary: {
        location_name: locationName,
        coordinates: `${latitude}, ${longitude}`,
        land_area: 1000,
        zoning_category: "Unknown",
        parcel_id: parcel.id,
      },
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      interpretation,
      metadata: {
        source: externalData.is_offline ? "offline_fallback" : "external_api",
        data_sources: externalData.sources,
        is_offline: externalData.is_offline,
        cached: false,
        data_quality_score: dataQualityScore,
      },
    });
  } catch (error) {
    console.error("Evaluate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
