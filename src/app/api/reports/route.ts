import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Revalidate cache every 5 minutes
export const revalidate = 300;

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

    // Ensure user exists in database
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

    // Fetch user's recent reports (last 5)
    const reports = await prisma.report.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        parcel: true,
      },
    });

    // Format dates for display
    const formatted = reports.map((report) => ({
      id: report.parcel.id,
      reportId: report.id,
      name: report.location_name,
      date: formatRelativeTime(report.createdAt),
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
