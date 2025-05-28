import * as doctorService from "../services/doctoService.js";
import { getDoctorWithPatients } from "../services/doctoService.js";
import { unlinkDoctorAndPatient } from "../services/doctoService.js";

export const createDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.deleteDoctor(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// controllers/patientController.js

export const deletePatientFromDoctor = async (req, res) => {
  const { patientId } = req.params;
  const doctorId = req.user.id; // or req.user._id depending on your auth middleware

  try {
    const message = await unlinkDoctorAndPatient(doctorId, patientId);
    res.json({ message });
  } catch (error) {
    console.error("Error deleting patient:", error);
    if (
      error.message === "Doctor not found" ||
      error.message === "Patient not found"
    ) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPatients = async (req, res) => {
  try {

    const doctorId = req.user.id; // set by auth middleware
    const patients = await getDoctorWithPatients(doctorId);

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error getting patients:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
