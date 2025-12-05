"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMyPathway = createMyPathway;
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
/////////
async function createMyPathway({ userId, title, steps, aiSummary, aiData, badgeNames = [], }) {
    // Check user already has the same pathway title
    const existing = await client_1.db.query.myPathways.findFirst({
        where: (mp, { eq, and }) => and(eq(mp.userId, userId), eq(mp.title, title)),
    });
    const pathwayRow = existing
        ? existing
        : (await client_1.db
            .insert(schema_1.myPathways)
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
        const badgeRows = await client_1.db.query.badges.findMany({
            where: (0, drizzle_orm_1.inArray)(schema_1.badges.name, badgeNames),
        });
        if (badgeRows.length > 0) {
            await client_1.db.insert(schema_1.myPathwayBadges).values(badgeRows.map((b) => ({
                pathwayId: pathwayRow.id,
                badgeId: b.id,
            })));
        }
    }
    return pathwayRow;
}
