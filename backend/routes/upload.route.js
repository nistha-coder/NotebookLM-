import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { loadDocuments } from "../services/loader.service.js";

import { chunkDocuments } from "../services/chunk.service.js";

import { storeDocuments } from "../services/vector.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, "../uploads/"),
});

router.post(
  "/",
  upload.single("file"),

  async (req, res) => {
    try {
      const filePath = req.file.path;

      const originalName = req.file.originalname;

      // load documents
      const docs = await loadDocuments(filePath, originalName);

      // chunking
      const splittedDocs = await chunkDocuments(docs);

      // embeddings + vector db
    const collectionName =
  path.parse(originalName).name +
  "-" +
  Date.now();

await storeDocuments(
  splittedDocs,
  collectionName
);

global.currentCollection =
  collectionName;

      res.json({
        success: true,

        message: "File Uploaded & Indexed Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  },
);

export default router;
