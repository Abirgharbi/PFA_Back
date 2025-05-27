import express from "express";
import routes from "./routes/index.js"; // Import all routes from index.js
import dotenv from "dotenv"; // Import dotenv for environment variables
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./Middleware/errorHandler.js";

// Créez l'équivalent de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: 'http://localhost:8080', // Spécifiez explicitement l'origine frontend
  credentials: true, // Autorisez les credentials
  optionsSuccessStatus: 200 // Pour les navigateurs anciens
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes

app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

app.use(errorHandler);


// Connect to MongoDB
(async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
