"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const options = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const TriggerIcon = !mounted
    ? Sun
    : theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="border-indigo-200/70 bg-background/80 shadow-sm backdrop-blur-sm dark:border-indigo-900/60"
          aria-label="Theme"
        >
          <TriggerIcon className="size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end">
        <div className="flex flex-col gap-0.5">
          {options.map(({ value, label, icon: Icon }) => {
            const isSelected = theme === value;
            return (
              <Button
                key={value}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-full justify-start gap-2 px-2 font-normal",
                  isSelected && "bg-accent",
                )}
                onClick={() => setTheme(value)}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isSelected ? (
                  <Check className="size-4 shrink-0 opacity-80" />
                ) : (
                  <span className="size-4 shrink-0" aria-hidden />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
