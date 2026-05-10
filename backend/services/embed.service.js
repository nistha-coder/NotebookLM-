import { pipeline } from "@xenova/transformers";

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export const embeddings = {
  async embedDocuments(texts) {
    const embed = await getEmbedder();
    const vectors = [];
    for (const text of texts) {
      if (!text || text.trim().length === 0) continue;
      const output = await embed(text, { pooling: "mean", normalize: true });
      vectors.push(Array.from(output.data));
    }
    return vectors;
  },

  async embedQuery(text) {
    const embed = await getEmbedder();
    const output = await embed(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }
};