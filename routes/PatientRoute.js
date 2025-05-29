import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addPatientToDoctor,
  getMydoctors,
} from "../controllers/patientController.js";
import verifyToken from "../Middleware/AuthVerify.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/mydoctors", verifyToken, getMydoctors); // Assuming this is to get patients for the authenticated user
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.post("/addingpatient/:idoctor", verifyToken, addPatientToDoctor);

export default router;
