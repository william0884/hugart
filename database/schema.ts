import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const characterTable = pgTable("char_table", {
  id: serial("id").primaryKey(),
  sentence: text("sentence").notNull(),
  url: text("url").notNull(),
  imgdescribe: text("imgdescribe").notNull(),
});

export const generatedTable = pgTable("char_gen", {
  id: serial("id").primaryKey(),
  sentence: text("sentence").notNull(),
  url: text("url").notNull(),
  charId: integer("char_id").references(() => characterTable.id),
});
