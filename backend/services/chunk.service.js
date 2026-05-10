import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function chunkDocuments(docs) {
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });

  const splittedDocs =
    await splitter.splitDocuments(docs);

  return splittedDocs;
}