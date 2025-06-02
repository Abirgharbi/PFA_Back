import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import Rapport from "../models/Rapport.js";
import { sendEmailadding } from "../utils/SendEmail.js";
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
  if (!doctor) throw new Error("Doctor not found");

  const patient = await Patient.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  // Remove patientId from doctor's patients array
  doctor.patients = doctor.patients.filter((id) => id.toString() !== patientId);
  await doctor.save();

  // Remove doctorId from patient's doctors array
  patient.doctors = patient.doctors.filter((id) => id.toString() !== doctorId);
  await patient.save();

  // Remove doctorId and doctor's email from patient's rapports
  const doctorEmail = doctor.email; // ensure email exists on the Doctor schema

  await Rapport.updateMany(
    { patient: patientId },
    {
      $pull: {
        sharedWith: doctor._id,
        sharedEmails: doctorEmail,
      },
    }
  );

  return "Doctor and Patient unlinked successfully";
};

export const sendinvitationToPatientservice = async (
  doctorID,
  patientemail,
  url
) => {
  try {
    const doctor = await Doctor.findById(doctorID);
    const patient = await Patient.findOne({ email: patientemail }); // use findOne

    if (!doctor || !patient || !patient.email) {
      throw new Error("Doctor or Patient not found or invalid email");
    }

    const urlfinal = `${url}${doctorID}`;

    await sendEmailadding(patient.email, undefined, urlfinal);

    return "Invitation sent successfully";
  } catch (error) {
    console.error("Error sending invitation:", error);
    throw new Error("Failed to send invitation");
  }
};
