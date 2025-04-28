import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import dotenv from 'dotenv';


// Load environment variables from .env file
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'abir';

// Register Patient
export const registerPatient = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const patient = new Patient({ fullName, email, password: hashedPassword });
    await patient.save();

    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ user: patient, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register Doctor
export const registerDoctor = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const doctor = new Doctor({ fullName, email, password: hashedPassword });
    await doctor.save();

    const token = jwt.sign({ id: doctor._id, role: 'doctor' }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ user: doctor, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login for Patient or Doctor
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Patient.findOne({ email });
    let role = 'patient';

    if (!user) {
      user = await Doctor.findOne({ email });
      role = 'doctor';
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
