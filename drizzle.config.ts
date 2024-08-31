import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL); // Debugging line

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
