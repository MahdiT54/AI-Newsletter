"use server";

import {
  isPrismaError,
  wrapDatabaseOperation,
} from "@/lib/database/error-handler";
import { prisma } from "@/lib/prisma";

// ============================================
// USER ACTIONS
// ============================================

/**
 * Fetches a user by their Clerk user ID
 *
 * @param clerkUserId - The Clerk authentication ID
 * @returns User record or null if not found
 */
export async function getUserByClerkId(clerkUserId: string) {
  return wrapDatabaseOperation(async () => {
    return await prisma.user.findUnique({
      where: { clerkUserId },
    });
  }, "fetch user by Clerk ID");
}

/**
 * Creates a user if they don't exist, or returns the existing user
 * Updates the timestamp when user already exists (tracks last activity)
 *
 * Note: Uses findUnique + create pattern instead of upsert to avoid transactions
 * (MongoDB Atlas free tier M0 doesn't support transactions). On create races
 * (e.g. parallel dashboard server components), catches P2002 and returns the
 * existing user.
 *
 * @param clerkUserId - The Clerk authentication ID
 * @returns User record (either created or existing)
 */
export async function upsertUserFromClerk(clerkUserId: string) {
  return wrapDatabaseOperation(async () => {
    // Try to find existing user
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (existingUser) {
      // Update timestamp for existing user
      return await prisma.user.update({
        where: { clerkUserId },
        data: {
          updatedAt: new Date(),
        },
      });
    }

    // Create new user if doesn't exist
    try {
      return await prisma.user.create({
        data: {
          clerkUserId,
        },
      });
    } catch (error) {
      // Parallel callers both tried to create the same user
      if (isPrismaError(error) && error.code === "P2002") {
        return await prisma.user.update({
          where: { clerkUserId },
          data: {
            updatedAt: new Date(),
          },
        });
      }
      throw error;
    }
  }, "upsert user");
}
