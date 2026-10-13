import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { guests } from "@db/schema";
import { desc } from "drizzle-orm";

const ADMIN_KEY = process.env["ADMIN_KEY"] && !process.env["ADMIN_KEY"].includes("stub") ? process.env["ADMIN_KEY"] : "neon-admin-2410";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  guests: createRouter({
    // Присоединиться к вечеринке
    join: publicQuery
      .input(z.object({ name: z.string().trim().min(1).max(100) }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const existing = await db.query.guests.findFirst({
          where: (g, { eq }) => eq(g.name, input.name),
        });
        if (existing) return { ok: true as const, already: true as const };
        await db.insert(guests).values({ name: input.name });
        return { ok: true as const, already: false as const };
      }),

    // Общий список имён (без внутренних данных)
    list: publicQuery.query(async () => {
      const db = getDb();
      const rows = await db
        .select({ id: guests.id, name: guests.name })
        .from(guests)
        .orderBy(desc(guests.createdAt));
      return rows;
    }),

    // Админский список с датами
    adminList: publicQuery
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        if (input.key !== ADMIN_KEY) throw new Error("Неверный ключ");
        const db = getDb();
        return db.select().from(guests).orderBy(desc(guests.createdAt));
      }),

    // Удалить гостя (админ)
    remove: publicQuery
      .input(z.object({ key: z.string(), id: z.number() }))
      .mutation(async ({ input }) => {
        if (input.key !== ADMIN_KEY) throw new Error("Неверный ключ");
        const db = getDb();
        const { eq } = await import("drizzle-orm");
        await db.delete(guests).where(eq(guests.id, input.id));
        return { ok: true as const };
      }),
  }),
});

export type AppRouter = typeof appRouter;
