import { QdrantVectorStore } from "@langchain/qdrant";

import { embeddings } from "./embed.service.js";



export async function storeDocuments(docs,
  collectionName) {
  await QdrantVectorStore.fromDocuments(
    docs,
    embeddings,
    {
      url: process.env.QDRANT_URL,
 apiKey: process.env.QDRANT_API_KEY,
      collectionName
    }
  );

  console.log("Indexing Completed");
}

export async function searchDocuments(
  userQuery
) {
  const vectorStore =
    await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
apiKey: process.env.QDRANT_API_KEY,
        collectionName:  global.currentCollection
      }
    );

  const retriever =
    vectorStore.asRetriever({
      k: 3
    });

  const searchedChunks =
    await retriever.invoke(userQuery);

  return searchedChunks;
}