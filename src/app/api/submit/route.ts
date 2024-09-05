import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { put } from "@vercel/blob";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// Function to fetch and convert an image URL to a Blob
async function fetchImageAsBlob(imageUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error("Failed to fetch image from URL:", response.statusText);
      return null;
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image from URL:", error);
    return null;
  }
}

async function performImageToImage(
  inputImageBlob: Blob,
  prompt: string,
): Promise<Blob | null> {
  try {
    const response = await hf.imageToImage({
      model: "timbrooks/instruct-pix2pix",
      inputs: inputImageBlob,
      options: { wait_for_model: true },
      parameters: {
        prompt: prompt,
      },
    });

    if (response && response instanceof Blob) {
      return response;
    }

    return null;
  } catch (error) {
    console.error("Error during image-to-image transformation:", error);
    return null;
  }
}

async function uploadToVercelBlob(
  fileName: string,
  imageBlob: Blob,
): Promise<string | null> {
  try {
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await put(fileName, buffer, {
      access: "public",
      contentType: imageBlob.type,
    });

    console.log(result);

    return result.url;
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, inputData: prompt } = await request.json(); // Extract the prompt from the form data

    if (
      !imageUrl ||
      typeof imageUrl !== "string" ||
      !prompt ||
      typeof prompt !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid data submitted." },
        { status: 400 },
      );
    }

    const inputImageBlob = await fetchImageAsBlob(imageUrl);

    if (!inputImageBlob) {
      return NextResponse.json(
        { error: "Failed to fetch image from URL." },
        { status: 500 },
      );
    }

    const transformedImageBlob = await performImageToImage(
      inputImageBlob,
      prompt,
    );

    if (!transformedImageBlob) {
      return NextResponse.json(
        { error: "Failed to perform image-to-image transformation." },
        { status: 500 },
      );
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    const uploadedImageUrl = await uploadToVercelBlob(
      fileName,
      transformedImageBlob,
    );

    if (!uploadedImageUrl) {
      return NextResponse.json(
        { error: "Failed to upload image to Vercel Blob." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Image uploaded successfully!",
      imageUrl: uploadedImageUrl,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: "Failed to upload file again", details: errorMessage },
      { status: 500 },
    );
  }
}
