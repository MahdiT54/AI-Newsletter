import { auth } from "@clerk/nextjs/server";
import { Crown, Settings as SettingsIcon } from "lucide-react";
import { getCurrentUserSettings } from "@/actions/user-settings";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingCards } from "@/components/dashboard/pricing-cards";
import { SettingsForm } from "@/components/dashboard/settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto py-12 px-6 lg:px-8">
          <Card className="lic-panel transition-all hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-base">
                Please sign in to access settings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const isPro = await has({ plan: "pro" });
  const settings = isPro ? await getCurrentUserSettings() : null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          icon={SettingsIcon}
          title="Settings"
          description="Configure default settings for your newsletter generation. These settings will be automatically applied to all newsletters you create."
        />

        {/* Free User Upgrade Prompt */}
        {!isPro && (
          <Card className="lic-panel border-2 border-indigo-600/70 bg-gradient-to-br from-indigo-50 to-cyan-50 transition-all hover:shadow-lg dark:border-indigo-500/70 dark:from-indigo-950/25 dark:to-cyan-950/25">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-700 to-cyan-600 text-white">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-3xl lic-highlight">
                    Upgrade to Pro
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Customize your newsletter with persistent settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="space-y-4 flex-1">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Pro users can save default newsletter settings including:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-700 to-cyan-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Newsletter name, description, and target audience
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-700 to-cyan-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Brand voice, company information, and industry
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-700 to-cyan-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Custom disclaimers, footers, and sender information
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="inline-flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-700 to-cyan-600 text-white shrink-0 mt-0.5">
                      <SettingsIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">
                      Automatic application to all generated newsletters
                    </span>
                  </li>
                </ul>
              </div>

              {/* Pricing Cards */}
              <div className="w-full lg:w-auto lg:flex-1">
                <PricingCards compact />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Form */}
        {isPro && <SettingsForm initialSettings={settings} />}
      </div>
    </div>
  );
}
