import express from "express";
import routes from "./routes/index.js"; // Import all routes from index.js
import dotenv from "dotenv"; // Import dotenv for environment variables
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./Middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:8080",
  "http://192.168.1.17:8080",
  "http://172.16.11.199:8080",
  "http://192.168.1.117:8080",
  "capacitor://localhost",
  "http://192.168.1.11:8080/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors({ origin: "*", credentials: true }));

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
