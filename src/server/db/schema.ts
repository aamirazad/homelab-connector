// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator, serial, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `homelab_${name}`,
);

export const users = createTable("users", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull().unique(),
  paperlessURL: varchar("paperlessURL", { length: 256 }),
  paperlessToken: varchar("paperlessToken", { length: 256 }),
  whishperURL: varchar("whishperURL", { length: 256 }),
});

export type UsersTableType = typeof users.$inferSelect;
