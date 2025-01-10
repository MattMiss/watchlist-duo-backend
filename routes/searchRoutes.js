import express from "express";
import { searchMedia } from "../controllers/searchController.js";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

// Search media
router.get("/search", verifyTokenMiddleware, searchMedia);

export default router;