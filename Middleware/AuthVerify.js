import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Doctor from "../models/doctor.js";

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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token invalide" });
  }
};

export const authenticateDoctor = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) return res.status(401).json({ message: "Doctor not found" });

    req.user = { id: doctor._id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
export default verifyToken;
