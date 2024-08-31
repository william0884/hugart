import { getCharacter } from "rickmortyapi";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { characterTable } from "../../../../database/schema";
import { HfInference } from "@huggingface/inference";
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function PUT() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    //console.log(characters);

    for (let i = 2; i < 825; i++) {
      //826
      console.log("Block statement execution no." + i);

      const char = await getCharacter(i);
      console.log(char);

      const sentence = `${char.data.name} the ${char.data.gender} ${char.data.species} originally from ${char.data.origin.name} but currently located on ${char.data.location.name} is ${char.data.status}.`;
      const fetchImg = await fetch(char.data.image);
      const arrayBuffer = await fetchImg.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imgclas = await hf.imageToText({
        data: buffer,
        model: "nlpconnect/vit-gpt2-image-captioning",
      });

      await db.insert(characterTable).values({
        sentence: sentence,
        url: char.data.image,
        imgdescribe: imgclas.generated_text,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
