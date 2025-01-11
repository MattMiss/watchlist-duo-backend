import express from "express";
import cors from "cors";
import myListRoutes from "./routes/myListRoutes.js";
import duoPartnerRoutes from "./routes/duoPartnerListRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();

// CORS Middleware
const corsOptions = {
    origin: [
        "http://localhost:5173", // Local frontend for development
        "https://mattmiss.github.io", // GitHub Pages for production
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Body Parsing Middleware
app.use(express.json());

// Routes
app.use("/api", myListRoutes);
app.use("/api", duoPartnerRoutes);
app.use("/api", searchRoutes);

export default app;
