import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateRisk } from "@/services/business/risk";
import { calculateConfidence } from "@/services/business/confidence";
import { getInterpretation } from "@/lib/ai/interpret";
import { fetchExternalAPIData } from "@/services/external";
import { getCachedParcel, cacheParcelData, createUserParcelFromCache, createReport } from "@/services/cache";
import { getDataSourceQualityScore } from "@/services/external";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Missing latitude or longitude" },
        { status: 400 }
      );
    }

    // Get authenticated user
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    const user = await getUser();

    if (!isAuth || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Ensure user exists in database (create if first time)
    const dbUser = await prisma.user.upsert({
      where: { kindeId: user.id },
      create: {
        kindeId: user.id,
        email: user.email || "",
        name: user.given_name || user.family_name || undefined,
        givenName: user.given_name || undefined,
        familyName: user.family_name || undefined,
        picture: user.picture || undefined,
      },
      update: {
        email: user.email || "",
        name: user.given_name || user.family_name || undefined,
        givenName: user.given_name || undefined,
        familyName: user.family_name || undefined,
        picture: user.picture || undefined,
      },
    });

    const userId = dbUser.id;

    // 1. Check cache first (within 500m tolerance)
    const cachedParcel = await getCachedParcel(latitude, longitude, 0.5);

    let parcel;
    let engineOutput;
    let confidenceOutput;
    let interpretation;
    let isFromCache = false;

    if (cachedParcel) {
      // Create a user-owned copy of the cached parcel
      parcel = await createUserParcelFromCache(cachedParcel, userId);
      isFromCache = true;

      // Calculate risk from cached data
      engineOutput = calculateRisk({
        soil_index: cachedParcel.soil_index,
        flood_index: cachedParcel.flood_index,
        environmental_index: cachedParcel.environmental_index,
        zoning_index: cachedParcel.zoning_index,
        topography_index: cachedParcel.topography_index,
      });

      confidenceOutput = calculateConfidence({
        data_completeness: cachedParcel.data_completeness,
        model_consistency: cachedParcel.model_consistency,
        data_recency: cachedParcel.data_recency,
      });
    } else {
      // 2. Fetch from external APIs (cache miss)
      const externalData = await fetchExternalAPIData(latitude, longitude);

      // 3. Calculate risk using engine
      engineOutput = calculateRisk({
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

      confidenceOutput = calculateConfidence({
        data_completeness: externalData.is_offline ? 0.5 : 0.9 * dataQualityScore,
        model_consistency: 0.8,
        data_recency: 1.0,
      });

      // 5. Cache the result (global cache without userId for sharing raw data)
      const locationName = `Location ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      const cachedResult = await cacheParcelData(
        latitude,
        longitude,
        { ...externalData, ...engineOutput },
        locationName,
        undefined // No userId for global cache
      );

      // Create user-owned copy
      parcel = await createUserParcelFromCache(cachedResult, userId);
    }

    // 6. Get AI interpretation
    interpretation = await getInterpretation({
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      parcel_metadata: {
        location_name: parcel.location_name,
        coordinates: `${parcel.latitude}, ${parcel.longitude}`,
        land_area: parcel.land_area,
        zoning_category: parcel.zoning_category,
      },
    });

    // Add offline context to interpretation
    if (parcel.is_offline_mode) {
      interpretation.limitations +=
        " Note: Some data sources were unavailable. Analysis based on limited data. Consider verifying with on-site assessment.";
    }

    // 7. Create persistent report owned by user
    const report = await createReport(userId, parcel.id, {
      location_name: parcel.location_name,
      coordinates: `${parcel.latitude}, ${parcel.longitude}`,
      land_area: parcel.land_area,
      zoning_category: parcel.zoning_category,
      data_source: parcel.data_source_label,
      risk_score: engineOutput.risk_score,
      classification: engineOutput.classification,
      dominant_factor: engineOutput.dominant_factor,
      factor_breakdown: engineOutput.factor_breakdown,
      confidence_score: confidenceOutput.confidence_score,
      completeness_score: confidenceOutput.completeness_score,
      consistency_score: confidenceOutput.consistency_score,
      recency_score: confidenceOutput.recency_score,
      low_integrity: confidenceOutput.low_integrity,
      summary: interpretation.summary,
      key_observations: interpretation.key_observations,
      recommended_action: interpretation.recommended_action,
      limitations: interpretation.limitations,
    });

    return NextResponse.json({
      location_summary: {
        location_name: parcel.location_name,
        coordinates: `${parcel.latitude}, ${parcel.longitude}`,
        land_area: parcel.land_area,
        zoning_category: parcel.zoning_category,
        parcel_id: parcel.id,
        report_id: report.id,
      },
      engine_output: engineOutput,
      confidence_output: confidenceOutput,
      interpretation,
      metadata: {
        source: isFromCache ? "cache" : (parcel.is_offline_mode ? "offline_fallback" : "external_api"),
        data_sources: parcel.data_source_label.split(", "),
        is_offline: parcel.is_offline_mode,
        cached: isFromCache,
        data_quality_score: parcel.is_offline_mode ? 0.5 : undefined,
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
