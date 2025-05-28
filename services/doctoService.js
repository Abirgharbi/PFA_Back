import Doctor from "../models/doctor.js";
import Patient from '../models/patient.js';
export const createDoctor = async (data) => {
  const doctor = new Doctor(data);
  return await doctor.save();
};

export const getAllDoctors = async () => {
  return await Doctor.find();
};

export const getDoctorById = async (id) => {
  return await Doctor.findById(id);
};

export const updateDoctor = async (id, data) => {
  return await Doctor.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDoctor = async (id) => {
  return await Doctor.findByIdAndDelete(id);
};
export const getDoctorWithPatients = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).populate({
    path: "patients",
    select: "-password -twoFactorCode -twoFactorCodeExpires", // hide sensitive fields
  });

  if (!doctor) throw new Error("Doctor not found");

  return doctor.patients;
};
// services/patientService.js





export const unlinkDoctorAndPatient = async (doctorId, patientId) => {
  // Find doctor and patient
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error('Patient not found');

  // Remove patientId from doctor's patients array
  doctor.patients = doctor.patients.filter(id => id.toString() !== patientId);
  await doctor.save();

  // Remove doctorId from patient's doctors array
  patient.doctors = patient.doctors.filter(id => id.toString() !== doctorId);
  await patient.save();

  return 'Doctor and Patient unlinked successfully';
};

