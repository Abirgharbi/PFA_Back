import Doctor from "../models/doctor.js";

export const authenticateDoctor = async (req, res, next) => {
  console.log("Authenticating doctor...");
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }
};
