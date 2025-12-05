import { db } from "../db/client";
import { pathways } from "../db/schema";
import { eq } from "drizzle-orm";

export type Step = { title: string; subtitle?: string; meta?: string };

export type Pathway = {
  id: string;
  templateSlug: string;
  steps: Step[];
  updatedAt: number;
};

// Create or update
export async function upsertPathway(input: Pathway): Promise<Pathway> {
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
  steps: row.steps as Step[],
  updatedAt: row.updatedAt.getTime(),
};

}


// Get one pathway by id
export async function getPathwayById(id: string): Promise<Pathway | null> {
  const [row] = await db
    .select()
    .from(pathways)
    .where(eq(pathways.id, id));

  if (!row) return null;

  return {
    id: row.id,
    templateSlug: row.templateSlug,
    steps: row.steps as Step[],
    updatedAt: row.updatedAt.getTime(),
  };
}

// List all pathways
export async function listPathways(): Promise<Pathway[]> {
  try {
    const rows = await db.select().from(pathways);

    return rows.map((row) => ({
      id: row.id,
      templateSlug: row.templateSlug,
      steps: row.steps as Step[],
      updatedAt: row.updatedAt instanceof Date
        ? row.updatedAt.getTime()
        : new Date(row.updatedAt as any).getTime(),
    }));
  } catch (err) {
    console.error("ERROR in listPathways:", err);
    throw err;
  }
}


// Delete pathway
export async function deletePathwayById(id: string): Promise<void> {
  await db.delete(pathways).where(eq(pathways.id, id));
}
