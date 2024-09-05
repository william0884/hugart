import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { generatedTable } from "../../../../../database/schema"; // Adjust the path as necessary
import { eq } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const id = params.id;

    const result = await db
      .select()
      .from(generatedTable)
      .where(eq(generatedTable.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return new NextResponse("Item not found", { status: 404 });
    }

    return NextResponse.json(result[0], {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new NextResponse("Failed to fetch data", { status: 500 });
  }
}