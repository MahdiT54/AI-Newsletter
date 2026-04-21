"use client";

import { SignOutButton } from "@clerk/nextjs";
import { History, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import { FeedPilotLogo } from "@/components/feedpilot-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/history",
      label: "History",
      icon: History,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/dashboard/account",
      label: "Account",
      icon: User,
    },
  ];

  return (
    <header className="border-b border-indigo-200/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 dark:border-indigo-900/60">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <FeedPilotLogo variant="header" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard/history" &&
                    pathname.startsWith("/dashboard/history")) ||
                  (item.href === "/dashboard/account" &&
                    pathname.startsWith("/dashboard/account"));
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        isActive &&
                          "bg-linear-to-r from-indigo-700 to-cyan-600 text-white font-medium hover:from-indigo-800 hover:to-cyan-700",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <PlanBadge />
            <SignOutButton>
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex flex-wrap items-center gap-1 pb-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard/history" &&
                pathname.startsWith("/dashboard/history")) ||
              (item.href === "/dashboard/account" &&
                pathname.startsWith("/dashboard/account"));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 transition-all",
                    isActive &&
                      "bg-linear-to-r from-indigo-700 to-cyan-600 text-white font-medium hover:from-indigo-800 hover:to-cyan-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
