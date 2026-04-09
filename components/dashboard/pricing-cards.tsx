import { PricingTable } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";

interface PricingCardsProps {
  compact?: boolean;
}

export function PricingCards({ compact = false }: PricingCardsProps) {
  return (
    <div className="flex justify-center w-full">
      <div className={compact ? "max-w-4xl w-full" : "max-w-5xl w-full"}>
        <PricingTable
          appearance={{
            elements: {
              pricingTableCardHeader: {
                backgroundColor: "#6A47FB",
                color: "white",
              },
              pricingTableCardTitle: {
                fontSize: compact ? "1.5rem" : "2rem",
                fontWeight: "bold",
                color: "white",
              },
              pricingTableCardDescription: {
                fontSize: compact ? "0.875rem" : "1rem",
                color: "white",
              },
              pricingTableCardFee: {
                color: "white",
              },
              pricingTableCardFeePeriod: {
                color: "white",
              },
              /*
               * "Upcoming" uses badge colorScheme primary (muted translucent grays).
               * PricingTable is mounted by clerk-js, so globals.css often does not apply;
               * these rules ship with the appearance config Clerk injects into the host.
               */
              badge: {
                '&[data-color="primary"]': {
                  backgroundColor: "#ffffff",
                  color: "#4a1fb8",
                  borderColor: "rgba(255, 255, 255, 0.55)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.12)",
                },
              },
            },
          }}
          fallback={
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-10" />
            </div>
          }
        />
      </div>
    </div>
  );
}
