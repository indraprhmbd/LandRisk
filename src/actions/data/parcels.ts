import prisma from "@/lib/db";
import { Parcel } from "@prisma/client";

// Re-export type for frontend use
export type { Parcel };

/**
 * Fetch all parcels from the database.
 * No business logic, just data access.
 */
export async function getParcels() {
  try {
    const parcels = await prisma.parcel.findMany({
      orderBy: { created_at: "desc" },
    });
    return parcels;
  } catch (error) {
    console.error("Database Error: Failed to fetch parcels", error);
    throw new Error("Failed to fetch parcels");
  }
}

/**
 * Fetch a single parcel by ID.
 */
export async function getParcelById(id: string) {
  try {
    const parcel = await prisma.parcel.findUnique({
      where: { id },
    });
    return parcel;
  } catch (error) {
    console.error(`Database Error: Failed to fetch parcel ${id}`, error);
    throw new Error(`Failed to fetch parcel ${id}`);
  }
}

/**
 * Find nearest parcel to coordinates (inefficient linear search for now, postgis later)
 */
export async function findNearestParcel(lat: number, lng: number) {
  try {
    const parcels = await prisma.parcel.findMany();
    if (parcels.length === 0) return null;

    let nearest = parcels[0];
    let minDist = Infinity;

    for (const parcel of parcels) {
      const dist = Math.sqrt(
        Math.pow(parcel.latitude - lat, 2) +
          Math.pow(parcel.longitude - lng, 2),
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = parcel;
      }
    }

    return { parcel: nearest, distance: minDist };
  } catch (error) {
    console.error("Database Error: Failed to find nearest parcel", error);
    throw new Error("Failed to find nearest parcel");
  }
}
