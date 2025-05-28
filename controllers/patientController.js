import {
  createPatientService,
  getAllPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
} from "../services/patientService.js";

// Create a new patient
export const createPatient = async (req, res) => {
  try {
    const patient = await createPatientService(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await getAllPatientsService();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await getPatientByIdService(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a patient by ID
export const updatePatient = async (req, res) => {
  try {
    const patient = await updatePatientService(req.params.id, req.body);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a patient by ID
export const deletePatient = async (req, res) => {
  try {
    const patient = await deletePatientService(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
