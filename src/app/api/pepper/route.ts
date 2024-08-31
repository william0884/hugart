export type Episodes = Episode[];

export interface Episode {
  name: string;
  total_pages: number;
  translated_languages: string[];
}

export async function GET() {
  try {
    const pepcar = await fetch(
      "https://peppercarrot.com/0_sources/episodes.json",
    );
    const jsonData: Episodes = await pepcar.json();

    const random: Episode =
      jsonData[Math.floor(Math.random() * jsonData.length)];

    console.log(random.name);
    const fields = random.name.split("_");
    const result = fields[1].replace(/[-]/g, " ");

    const numb = fields[0].toUpperCase();
    const numbRemov = numb.replace("P", "");

    const ranPage = Math.trunc(Math.random() * (random.total_pages - 1) + 1);

    const url =
      "https://peppercarrot.com/0_sources/" +
      random.name +
      "/low-res/en_Pepper-and-Carrot_by-David-Revoy_" +
      numbRemov +
      "P0" +
      ranPage +
      ".jpg";

    console.log(url);
    return new Response(JSON.stringify({ Name: result }), { status: 200 });
  } catch (error) {
    console.error("Error getting image:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
    });
  }
}
