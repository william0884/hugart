// src/app/api/fetch-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { generatedTable } from "../../../../database/schema"; // Adjust the path as necessary

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(req: NextRequest) {
  try {
    const result = await db.select().from(generatedTable);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching data:", err);
    return new NextResponse("Failed to fetch data", { status: 500 });
  }
}
