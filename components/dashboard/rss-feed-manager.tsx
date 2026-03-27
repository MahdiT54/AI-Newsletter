import { auth } from "@clerk/nextjs/server";
import { ExternalLink, Plus } from "lucide-react";
import { getRssFeedsByUserId } from "@/actions/rss-feed";
import { upsertUserFromClerk } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddFeedDialog } from "./add-feed-dialog";
import { DeleteFeedButton } from "./delete-feed-button";

interface RssFeed {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  lastFetched: Date | null;
  _count?: {
    articles: number;
  };
}

export async function RssFeedManager() {
  const { userId, has } = await auth();
  const isPro = await has({ plan: "pro" });
  const feedLimit = isPro ? Infinity : 3;

  const user = await upsertUserFromClerk(userId!);
  const feeds = (await getRssFeedsByUserId(user.id)) as RssFeed[];

  return (
    <Card className="lic-panel transition-all hover:shadow-lg overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-2xl">RSS Feeds</CardTitle>
            <CardDescription className="text-base">
              Manage your RSS feed sources{" "}
              {!isPro && `(${feeds.length}/${feedLimit} used)`}
            </CardDescription>
          </div>
          <AddFeedDialog
            currentFeedCount={feeds.length}
            feedLimit={feedLimit}
            isPro={isPro}
          />
        </div>
      </CardHeader>
      <CardContent>
        {feeds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No RSS feeds added yet
            </div>
            <AddFeedDialog
              currentFeedCount={feeds.length}
              feedLimit={feedLimit}
              isPro={isPro}
              trigger={
                <Button className="lic-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Feed
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="rounded-lg border border-indigo-200/70 p-4 transition-all hover:bg-accent/50 hover:shadow-md dark:border-indigo-900/60 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">
                        {feed.title || "Untitled Feed"}
                      </h3>
                    </div>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1 mb-2 text-sm text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span className="truncate break-all">{feed.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {feed.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 break-words">
                        {feed.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="whitespace-nowrap">
                        {feed._count?.articles ?? 0} article
                        {feed._count?.articles !== 1 ? "s" : ""}
                      </span>
                      {feed.lastFetched && (
                        <span className="whitespace-nowrap">
                          Last fetched:{" "}
                          {new Date(feed.lastFetched).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <DeleteFeedButton
                    feedId={feed.id}
                    feedTitle={feed.title || feed.url}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
