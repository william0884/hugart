import { HfInference } from "@huggingface/inference";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { characterTable, generatedTable } from "../../../../database/schema";
import { auth } from '@clerk/nextjs/server'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = auth()

    const pepcar = await fetch(
      "https://peppercarrot.com/0_sources/episodes.json",
    );
    const jsonData: Episodes = await pepcar.json();

    const random: Episode =
      jsonData[Math.floor(Math.random() * jsonData.length)];

    console.log(random.name);
    const fields = random.name.split("_");
    const results = fields[1].replace(/[-]/g, " ");

    const randomChar = Math.floor(Math.random() * 823) + 1;
    console.log(randomChar);
    const result = await db
      .select()
      .from(characterTable)
      .where(eq(characterTable.id, randomChar));
    const item = result[0];
    const { id, sentence, url, imgdescribe } = item;

    const imgCap = await hf.textToImage({
      inputs: sentence + " " + imgdescribe + " " + results,
      model: "black-forest-labs/FLUX.1-schnell",
    });

    const buff = Buffer.from(await imgCap.arrayBuffer());

    const arrayBuffer = await imgCap.arrayBuffer();

    const imgclas = await hf.imageToText({
      data: imgCap,
      model: "nlpconnect/vit-gpt2-image-captioning",
    });
    console.log(imgclas);

    const fileName = `${Date.now()}.png`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: buff,
      ContentType: 'image/png',
    });

    await s3Client.send(putObjectCommand);

    // Construct the public URL
    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    //const publicUrl = "test.com"

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await db.insert(generatedTable).values({
      userId: userId,
      sentence: sentence + " " + imgdescribe + " " + results,
      url: publicUrl,
      imgdescribe: imgclas.generated_text,
      charId: id,
      
    });

    console.log({
      sentence: sentence + " " + imgdescribe + " " + results,
      userId: userId,
      url: publicUrl,
      imgdescribe: imgclas.generated_text,
      charId: id,
    })

    return NextResponse.json({
      sentence: sentence + " " + imgdescribe + " " + results,
      userId: userId,
      url: publicUrl,
      imgdescribe: imgclas.generated_text,
      charId: id,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Failed to upload file again", details: errorMessage },
      { status: 500 },
    );
  }
}