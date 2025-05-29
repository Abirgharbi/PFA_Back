import {
  createPatientService,
  getAllPatientsService,
  getPatientByIdService,
  updatePatientService,
  deletePatientService,
  addPatientToDoctorService,
  getmydoctos
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

export const addPatientToDoctor = async (req, res) => {
  try {
    const { idoctor } = req.params;
    const patientID = req.user.id;

    const result = await addPatientToDoctorService(idoctor, patientID);

    if (result.alreadyConnected) {
      return res.status(200).json({ message: "You are already connected!" });
    }

    res
      .status(200)
      .json({ message: "Patient added and email sent successfully!" });
  } catch (error) {
    console.error("Error adding patient:", error.message);
    res.status(500).json({ error: "Failed to add patient." });
  }
};
export const getMydoctors = async (req, res) => {
  try {
    const patientId = req.user.id; // Assuming the patient ID is stored in req.user.id
    const doctors = await getmydoctos(patientId); // Adjust this to fetch doctors for the patient

    if (!doctors) return res.status(404).json({ message: "No doctors found" });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: error.message });
  }
}