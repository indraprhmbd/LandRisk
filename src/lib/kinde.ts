import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export { getKindeServerSession };

/**
 * Check if user is authenticated
 * Returns true if user is logged in
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const { isAuthenticated } = getKindeServerSession();
    const auth = await isAuthenticated();
    return auth ?? false;
  } catch {
    return false;
  }
}

/**
 * Get current user data
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const { getUser } = getKindeServerSession();
    return await getUser();
  } catch {
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(loginUrl: string = "/auth/login") {
  const authenticated = await checkAuth();
  if (!authenticated) {
    return { redirect: loginUrl };
  }
  return { user: await getCurrentUser() };
}
