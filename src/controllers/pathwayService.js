// src/controllers/pathwayService.ts
import { db } from "../db/client";
import { pathways } from "../db/schema";
import { eq } from "drizzle-orm";
// Create or update
export async function upsertPathway(input) {
    const { id, templateSlug, steps, updatedAt } = input;
    const updatedAtDate = new Date(updatedAt);
    const [row] = await db
        .insert(pathways)
        .values({
        id,
        templateSlug,
        steps,
        updatedAt: updatedAtDate,
    })
        .onConflictDoUpdate({
        target: pathways.id,
        set: {
            templateSlug,
            steps,
            updatedAt: updatedAtDate,
        },
    })
        .returning();
    if (!row) {
        throw new Error("Database upsert failed — no row returned");
    }
    return {
        id: row.id,
        templateSlug: row.templateSlug,
        steps: row.steps,
        updatedAt: row.updatedAt.getTime(),
    };
}
// Get one pathway by id
export async function getPathwayById(id) {
    const [row] = await db
        .select()
        .from(pathways)
        .where(eq(pathways.id, id));
    if (!row)
        return null;
    return {
        id: row.id,
        templateSlug: row.templateSlug,
        steps: row.steps,
        updatedAt: row.updatedAt.getTime(),
    };
}
// List all pathways
export async function listPathways() {
    try {
        const rows = await db.select().from(pathways);
        return rows.map((row) => ({
            id: row.id,
            templateSlug: row.templateSlug,
            steps: row.steps,
            updatedAt: row.updatedAt instanceof Date
                ? row.updatedAt.getTime()
                : new Date(row.updatedAt).getTime(),
        }));
    }
    catch (err) {
        console.error("ERROR in listPathways:", err);
        throw err;
    }
}
// Delete pathway
export async function deletePathwayById(id) {
    await db.delete(pathways).where(eq(pathways.id, id));
}
