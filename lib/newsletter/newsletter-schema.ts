import { z } from "zod";

/**
 * AI-generated newsletter shape. Shared by API route, server actions, and client streaming.
 */
export const NewsletterSchema = z.object({
  suggestedTitles: z.array(z.string()).length(5),
  suggestedSubjectLines: z.array(z.string()).length(5),
  body: z.string(),
  topAnnouncements: z.array(z.string()).length(5),
  /** Nullable so JSON schema lists every property under `required` (OpenAI structured output). */
  additionalInfo: z.string().nullable(),
});

export type GeneratedNewsletter = z.infer<typeof NewsletterSchema>;
