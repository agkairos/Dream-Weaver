import { db } from "./db";
import { calculations, type InsertCalculation, type Calculation } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getRecentCalculations(): Promise<Calculation[]>;
  getLatestCalculation(): Promise<Calculation | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getRecentCalculations(): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(10);
  }

  async getLatestCalculation(): Promise<Calculation | undefined> {
    const [calculation] = await db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt))
      .limit(1);
    return calculation;
  }
}

export const storage = new DatabaseStorage();
