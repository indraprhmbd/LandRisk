import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateRisk } from "@/services/business/risk";
import { calculateConfidence } from "@/services/business/confidence";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Revalidate cache every hour
export const revalidate = 3600;

export async function GET() {
  try {
    // Get authenticated user
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    
    if (!isAuth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
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

    // Fetch only parcels owned by the authenticated user
    const parcels = await prisma.parcel.findMany({
      where: { userId: dbUser.id },
      orderBy: { created_at: "desc" },
    });

    // Enrich each parcel with computed risk and confidence
    const enriched = parcels.map((parcel: any) => {
      const risk = calculateRisk({
        soil_index: parcel.soil_index,
        flood_index: parcel.flood_index,
        environmental_index: parcel.environmental_index,
        zoning_index: parcel.zoning_index,
        topography_index: parcel.topography_index,
      });

      const confidence = calculateConfidence({
        data_completeness: parcel.data_completeness,
        model_consistency: parcel.model_consistency,
        data_recency: parcel.data_recency,
      });

      return {
        id: parcel.id,
        location_name: parcel.location_name,
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        land_area: parcel.land_area,
        zoning_category: parcel.zoning_category,
        risk_score: risk.risk_score,
        classification: risk.classification,
        dominant_factor: risk.dominant_factor,
        confidence_score: confidence.confidence_score,
        low_integrity: confidence.low_integrity,
        data_source: parcel.data_source_label,
        last_updated: parcel.last_updated,
      };
    });

    return NextResponse.json({ parcels: enriched });
  } catch (error) {
    console.error("Parcels API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
