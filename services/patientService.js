import Patient from "../models/patient.js";

// Create a new patient
export const createPatientService = async (data) => {
  const patient = new Patient(data);
  return await patient.save();
};

// Get all patients
export const getAllPatientsService = async () => {
  return await Patient.find();
};

// Get a patient by ID
export const getPatientByIdService = async (id) => {
  return await Patient.findById(id);
};

// Update a patient by ID
export const updatePatientService = async (id, data) => {
  return await Patient.findByIdAndUpdate(id, data, { new: true });
};

// Delete a patient by ID
export const deletePatientService = async (id) => {
  return await Patient.findByIdAndDelete(id);
};
