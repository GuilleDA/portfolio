import Replicate from "replicate";

const replicateClient = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const output = (await replicateClient.run(
      "beautyyuyanli/multilingual-e5-large:a06276a89f1a902d5fc225a9ca32b6e8e6292b7f3b136518878da97c458e2bad",
      {
        input: {
          texts: JSON.stringify([text]),
          normalize_embeddings: true,
          batch_size: 1,
        },
      }
    )) as number[][];
    return output[0];
  } catch (error) {
    console.error("❌ Error al generar embedding:", error);
    throw new Error("Error al generar embedding con Replicate");
  }
}

export { replicateClient };
