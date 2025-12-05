"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertPathway = upsertPathway;
exports.getPathwayById = getPathwayById;
exports.listPathways = listPathways;
exports.deletePathwayById = deletePathwayById;
const client_1 = require("../db/client");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Create or update
async function upsertPathway(input) {
    const { id, templateSlug, steps, updatedAt } = input;
    const updatedAtDate = new Date(updatedAt);
    const [row] = await client_1.db
        .insert(schema_1.pathways)
        .values({
        id,
        templateSlug,
        steps,
        updatedAt: updatedAtDate,
    })
        .onConflictDoUpdate({
        target: schema_1.pathways.id,
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
async function getPathwayById(id) {
    const [row] = await client_1.db
        .select()
        .from(schema_1.pathways)
        .where((0, drizzle_orm_1.eq)(schema_1.pathways.id, id));
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
async function listPathways() {
    try {
        const rows = await client_1.db.select().from(schema_1.pathways);
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
async function deletePathwayById(id) {
    await client_1.db.delete(schema_1.pathways).where((0, drizzle_orm_1.eq)(schema_1.pathways.id, id));
}
