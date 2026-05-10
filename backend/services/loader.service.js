import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";

import { JSONLoader } from "langchain/document_loaders/fs/json";

import { TextLoader } from "langchain/document_loaders/fs/text";

export async function loadDocuments(
  filePath,
  originalName
) {

  const ext =
    path.extname(originalName);

  let loader;

  // PDF
  if (ext === ".pdf") {
    loader = new PDFLoader(filePath);
  }

  // CSV
  else if (ext === ".csv") {
    loader = new CSVLoader(filePath);
  }

  // DOCX
  else if (ext === ".docx") {
    loader = new DocxLoader(filePath);
  }

  // DOC
  else if (ext === ".doc") {
    loader = new DocxLoader(filePath, {
      type: "doc"
    });
  }

  // JSON
  else if (ext === ".json") {
    loader = new JSONLoader(filePath);
  }

  // PPTX
  else if (ext === ".pptx") {
    loader = new PPTXLoader(filePath);
  }

  // TXT
  else if (ext === ".txt") {
    loader = new TextLoader(filePath);
  }

  else {
    throw new Error("Unsupported File Type");
  }

  const docs = await loader.load();

  return docs;
}