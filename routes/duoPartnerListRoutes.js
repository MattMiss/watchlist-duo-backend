import express from "express";
import { getDuoPartnerList } from "../controllers/duoPartnerListController.js";
import verifyTokenMiddleware from "../middlewares/verifyTokenMiddleware.js";

const router = express.Router();

// Get duo partner's list
router.get("/duoPartnerList", verifyTokenMiddleware, getDuoPartnerList);

export default router;