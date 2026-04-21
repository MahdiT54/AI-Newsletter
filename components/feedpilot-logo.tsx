import Image from "next/image";
import { cn } from "@/lib/utils";

const lightSrc = "/feedpilotnoborder.png";
const darkSrc = "/feedpilotlogoinvertednoborder.png";

type FeedPilotLogoProps = {
  variant: "hero" | "header";
  priority?: boolean;
  className?: string;
};

export function FeedPilotLogo({
  variant,
  priority,
  className,
}: FeedPilotLogoProps) {
  const isHero = variant === "hero";

  return (
    <span className={cn("relative inline-block", className)}>
      <Image
        src={lightSrc}
        alt="FeedPilot"
        width={isHero ? 320 : 120}
        height={isHero ? 72 : 32}
        priority={priority}
        className={cn(
          isHero &&
            "mx-auto mb-6 h-auto w-auto max-h-24 max-w-full sm:max-h-28",
          "dark:hidden",
        )}
      />
      <Image
        src={darkSrc}
        alt="FeedPilot"
        width={isHero ? 320 : 120}
        height={isHero ? 72 : 32}
        priority={priority}
        className={cn(
          isHero &&
            "mx-auto mb-6 h-auto w-auto max-h-24 max-w-full sm:max-h-28",
          "hidden dark:block",
        )}
      />
    </span>
  );
}
