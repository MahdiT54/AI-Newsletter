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
 * Permanently deletes an RSS feed and cleans up articles not referenced by other feeds.
 *
 * Avoids interactive $transaction — MongoDB Atlas free tier + Prisma's 5s default
 * timeout cause P2028 when many articles are updated sequentially inside a txn.
 */
export async function deleteRssFeed(feedId: string) {
  return wrapDatabaseOperation(async () => {
    const relatedArticles = await prisma.rssArticle.findMany({
      where: {
        OR: [{ feedId }, { sourceFeedIds: { has: feedId } }],
      },
      select: {
        id: true,
        feedId: true,
        sourceFeedIds: true,
      },
    });

    const articleIdsToDelete: string[] = [];
    const articlesToReassign: Array<{
      id: string;
      feedId: string;
      sourceFeedIds: string[];
    }> = [];

    for (const article of relatedArticles) {
      const remainingSourceFeedIds = article.sourceFeedIds.filter(
        (sourceFeedId) => sourceFeedId !== feedId,
      );

      if (remainingSourceFeedIds.length === 0) {
        articleIdsToDelete.push(article.id);
        continue;
      }

      articlesToReassign.push({
        id: article.id,
        feedId:
          article.feedId === feedId
            ? remainingSourceFeedIds[0]
            : article.feedId,
        sourceFeedIds: remainingSourceFeedIds,
      });
    }

    if (articleIdsToDelete.length > 0) {
      await prisma.rssArticle.deleteMany({
        where: { id: { in: articleIdsToDelete } },
      });
    }

    for (const article of articlesToReassign) {
      await prisma.rssArticle.update({
        where: { id: article.id },
        data: {
          feedId: article.feedId,
          sourceFeedIds: article.sourceFeedIds,
        },
      });
    }

    await prisma.rssFeed.delete({
      where: { id: feedId },
    });

    return { success: true };
  }, "delete RSS feed");
}
