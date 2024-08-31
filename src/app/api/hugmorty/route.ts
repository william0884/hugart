import { HfInference } from "@huggingface/inference";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { characterTable, generatedTable } from "../../../../database/schema";
import { put } from "@vercel/blob";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export type Episodes = Episode[];

export interface Episode {
  name: string;
  total_pages: number;
  translated_languages: string[];
}
interface BlobResponse {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType?: string;
  contentDisposition?: string;
}
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const pepcar = await fetch(
      "https://peppercarrot.com/0_sources/episodes.json",
    );
    const jsonData: Episodes = await pepcar.json();

    const random: Episode =
      jsonData[Math.floor(Math.random() * jsonData.length)];

    console.log(random.name);
    const fields = random.name.split("_");
    const results = fields[1].replace(/[-]/g, " ");

    //const result = await db.select().from(characterTable);
    const randomChar = Math.floor(Math.random() * 823) + 1;
    console.log(randomChar);
    const result = await db
      .select()
      .from(characterTable)
      .where(eq(characterTable.id, randomChar));
    const item = result[0];
    const { id, sentence, url, imgdescribe } = item;

    //const imgCap = await hf.textToImage({
    //  inputs: "this is a black cat outside",
    //  model: "black-forest-labs/FLUX.1-dev",
    //});

    const imgCap = await hf.textToImage({
      inputs: sentence + " " + imgdescribe + " " + results,
      model: "stabilityai/stable-diffusion-2", // Replace with your preferred text-to-image model
    });

    // Convert the response to a buffer
    const buff = Buffer.from(await imgCap.arrayBuffer());

    const arrayBuffer = await imgCap.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imgclas = await hf.imageToText({
      data: imgCap,
      model: "nlpconnect/vit-gpt2-image-captioning",
    });

    //console.log("This image:", imgCap);

    //const imgBlob = new Blob([await imgCap.arrayBuffer()], {
    //  type: "image/png",
    //});
    //console.log("fileBlob type:", imgCap instanceof Blob);
    // Generate a unique file name
    const fileName = `${Date.now()}.png`;
    //const blob = await put(fileName, buff, {
    //  access: "public",
    //});

    const blob: BlobResponse = await put(fileName, buff, {
      access: "public",
    });

    //const { url } = await put(fileName, imgCap, { access: "public" });

    //const imgText = await hf.imageToText({
    //  data: imgBuffer,
    //  model: "nlpconnect/vit-gpt2-image-captioning",
    // });
    //
    await db.insert(generatedTable).values({
      sentence: sentence + " " + imgdescribe + " " + results,
      url: blob.url,
      charId: id,
    });

    return NextResponse.json({
      "generated text": imgclas.generated_text,
      image: blob,
      pepperEpisode: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file again", details: error.message },
      { status: 500 },
    );
  }
}
