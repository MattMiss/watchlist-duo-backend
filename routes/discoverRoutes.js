import express from "express";
import { getPopularMedia } from "../controllers/popularController.js";
import { getTrendingMedia } from "../controllers/trendingController.js";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

// Search media
router.get("/popular", verifyTokenMiddleware, getPopularMedia);
router.get("/trending", verifyTokenMiddleware, getTrendingMedia);

export default router;