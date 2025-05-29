import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
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

export const addPatientToDoctorService = async (idoctor, patientID) => {
  const doctor = await Doctor.findById(idoctor);
  const patient = await Patient.findById(patientID);

  if (!doctor || !patient) {
    throw new Error("Doctor or Patient not found");
  }

  const doctorHasPatient = doctor.patients.includes(patientID);
  const patientHasDoctor = patient.doctors.includes(idoctor);

  if (doctorHasPatient && patientHasDoctor) {
    return { alreadyConnected: true };
  }

  if (!doctorHasPatient) {
    doctor.patients.push(patientID);
    await doctor.save();
  }

  if (!patientHasDoctor) {
    patient.doctors.push(idoctor);
    await patient.save();
  }

  return { alreadyConnected: false };
};
export const getmydoctos = async (patientId) => {
  try {
    const patient = await Patient.findById(patientId).populate({
      path: "doctors",
      select: "fullName email",
    });
    return patient.doctors || [];
  } catch (error) {
    console.error("Error fetching patient's doctors:", error);
    throw new Error("Failed to fetch doctors for the patient");
  }
};