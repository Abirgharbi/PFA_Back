import express from "express";

import verifyToken from "../Middleware/AuthVerify.js";
import { createDoctor, deleteDoctor, getAllDoctors, getDoctorById, getMyPatients, updateDoctor } from "../controllers/doctorcontroller.js";
const router = express.Router();

router.post("/", createDoctor);
router.get("/", getAllDoctors);
router.get("/my-patients", verifyToken, getMyPatients);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
