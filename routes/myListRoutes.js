import express from "express";
import { addToMyList, deleteFromMyList, getMyList } from "../controllers/myListController.js";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

// Get user's list
router.get("/mylist", verifyTokenMiddleware, getMyList);

// Add media to user's list
router.post("/mylist", verifyTokenMiddleware, addToMyList);

// Delete media from user's list
router.delete("/mylist", verifyTokenMiddleware, deleteFromMyList);

export default router;