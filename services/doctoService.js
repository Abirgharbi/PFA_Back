import Doctor from "../models/doctor.js";

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
