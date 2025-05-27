import express from "express";
import * as doctorController from "../controllers/doctorcontroller.js";
import { authenticateDoctor } from "../Middleware/AuthVerify.js";
const router = express.Router();

router.post("/", doctorController.createDoctor);
router.get("/", doctorController.getAllDoctors);
router.get("/my-patients", authenticateDoctor, doctorController.getMyPatients);
router.get("/:id", doctorController.getDoctorById);
router.put("/:id", doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

export default router;
