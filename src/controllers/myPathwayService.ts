import { db } from "../db/client";
import { myPathways, myPathwayBadges, badges } from "../db/schema";
import { inArray, eq } from "drizzle-orm";
import type { Step, MyPathwayAiData } from "../db/schema";

type CreateMyPathwayArgs = {
  userId: string;         // Clerk userId
  title: string;          // what you want to show in the UI
  steps: Step[];          // final steps you already use in the app
  aiSummary?: string;     // optional: short summary for card
  aiData?: MyPathwayAiData; // optional: raw AI object
  badgeNames?: string[];  // optional: ["jobs", "electrician"]
};

export async function createMyPathway({
  userId,
  title,
  steps,
  aiSummary,
  aiData,
  badgeNames = [],
}: CreateMyPathwayArgs) {
  // 1) insert into my_pathways
  const [row] = await db
    .insert(myPathways)
    .values({
      userId,
      title,
      steps,
      aiSummary,
      aiData,
    })
    .returning();

  if (!row) throw new Error("Failed to create my_pathways");

  // 2) attach badges (if any)
  if (badgeNames.length > 0) {
    const badgeRows = await db.query.badges.findMany({
      where: inArray(badges.name, badgeNames),
    });

    if (badgeRows.length > 0) {
      await db.insert(myPathwayBadges).values(
        badgeRows.map((b) => ({
          pathwayId: row.id,
          badgeId: b.id,
        }))
      );
    }
  }

  return row; // or map it if you want
}
