import express from "express";

import { searchDocuments } from "../services/vector.service.js";

import { generateAnswer } from "../services/rag.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    // retrieval
    const searchedChunks =
      await searchDocuments(query);

    // llm response
    const answer =
      await generateAnswer(
        query,
        searchedChunks
      );

    res.json({
      success: true,

      answer
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      error: error.message
    });
  }
});

export default router;