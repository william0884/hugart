// src/app/api/fetch-data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { generatedTable } from "../../../../database/schema"; // Adjust the path as necessary
import { desc, eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";
export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const result = await db
      .select()
      .from(generatedTable)
      .where(eq(generatedTable.userId, userId))
      .orderBy(desc(generatedTable.id))
      .limit(10);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
  });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new NextResponse("Failed discoto fetch data", { status: 500 });
  }
}