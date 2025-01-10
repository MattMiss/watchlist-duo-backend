import dotenv from "dotenv";
import app from "./app.js"; // Import your main app
import "./config/firebase.js"; // Ensure Firebase is initialized

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});