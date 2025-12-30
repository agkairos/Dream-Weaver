import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull(), // 'wakeup' or 'bedtime'
  targetTime: text("target_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({ 
  id: true, 
  createdAt: true 
});

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
