import { db } from "../db/client";
import { myPathways, myPathwayBadges, badges } from "../db/schema";
import { inArray, eq, and } from "drizzle-orm";
export async function createMyPathway({ userId, title, steps, aiSummary, aiData, badgeNames = [], }) {
    // Check user already has the same pathway title
    const existing = await db.query.myPathways.findFirst({
        where: (mp, { eq, and }) => and(eq(mp.userId, userId), eq(mp.title, title)),
    });
    const pathwayRow = existing
        ? existing
        : (await db
            .insert(myPathways)
            .values({
            userId,
            title,
            steps,
            aiSummary,
            aiData,
        })
            .returning())[0];
    if (!pathwayRow) {
        throw new Error("Failed to create or fetch my_pathways");
    }
    // 2) attach badges (if any)
    if (badgeNames.length > 0) {
        const badgeRows = await db.query.badges.findMany({
            where: inArray(badges.name, badgeNames),
        });
        if (badgeRows.length > 0) {
            await db.insert(myPathwayBadges).values(badgeRows.map((b) => ({
                pathwayId: pathwayRow.id,
                badgeId: b.id,
            })));
        }
    }
    return pathwayRow;
}
