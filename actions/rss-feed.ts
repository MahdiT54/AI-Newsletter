"use server";

import { wrapDatabaseOperation } from "@/lib/database/error-handler";
import {
  FEED_ORDER_BY_CREATED_DESC,
  FEED_WITH_COUNT_INCLUDE,
} from "@/lib/database/prisma-helpers";
import { prisma } from "@/lib/prisma";

// ============================================
// RSS FEED ACTIONS
// ============================================

/**
 * Fetches all RSS feeds for a specific user with article counts
 */
export async function getRssFeedsByUserId(userId: string) {
  return wrapDatabaseOperation(async () => {
    return await prisma.rssFeed.findMany({
      where: {
        userId,
      },
      include: FEED_WITH_COUNT_INCLUDE,
      orderBy: FEED_ORDER_BY_CREATED_DESC,
    });
  }, "fetch RSS feeds");
}

/**
 * Updates the lastFetched timestamp for an RSS feed
 */
export async function updateFeedLastFetched(feedId: string) {
  return wrapDatabaseOperation(async () => {
    return await prisma.rssFeed.update({
      where: { id: feedId },
      data: {
        lastFetched: new Date(),
      },
    });
  }, "update feed last fetched");
}

/**
 * Permanently deletes an RSS feed and cleans up articles not referenced by other feeds
 */
export async function deleteRssFeed(feedId: string) {
  return wrapDatabaseOperation(async () => {
    await prisma.$transaction(async (tx) => {
      const relatedArticles = await tx.rssArticle.findMany({
        where: {
          OR: [{ feedId }, { sourceFeedIds: { has: feedId } }],
        },
        select: {
          id: true,
          feedId: true,
          sourceFeedIds: true,
        },
      });

      for (const article of relatedArticles) {
        const remainingSourceFeedIds = article.sourceFeedIds.filter(
          (sourceFeedId: string) => sourceFeedId !== feedId,
        );

        if (remainingSourceFeedIds.length === 0) {
          await tx.rssArticle.delete({ where: { id: article.id } });
          continue;
        }

        const nextFeedId =
          article.feedId === feedId
            ? remainingSourceFeedIds[0]
            : article.feedId;

        await tx.rssArticle.update({
          where: { id: article.id },
          data: {
            feedId: nextFeedId,
            sourceFeedIds: remainingSourceFeedIds,
          },
        });
      }

      await tx.rssFeed.delete({
        where: { id: feedId },
      });
    });

    return { success: true };
  }, "delete RSS feed");
}
