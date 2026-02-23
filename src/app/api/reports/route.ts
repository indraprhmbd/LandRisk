import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Revalidate cache every 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    // Fetch recent reports (last 5)
    const reports = await prisma.parcel.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        id: true,
        location_name: true,
        created_at: true,
      },
    });

    // Format dates for display
    const formatted = reports.map((report) => ({
      id: report.id,
      name: report.location_name,
      date: formatRelativeTime(report.created_at),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
