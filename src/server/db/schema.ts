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
  (name) => `homelab-connector_${name}`,
);

export const users = createTable("users", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull().unique(),
  fullName: varchar("name", { length: 256 }),
  paperlessURL: varchar("paperlessURL", { length: 256 }),
  paperlessAPI: varchar("paperlessAPI", { length: 256 }),
});