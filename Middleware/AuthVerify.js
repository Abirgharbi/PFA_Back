import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1]; // Supprime le mot "Bearer"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // tu peux maintenant accéder à req.user.id
    next(); // ou continue ton traitement
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token invalide" });
  }
};

export default verifyToken;
