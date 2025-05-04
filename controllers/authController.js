import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { sendEmail} from '../utils/SendEmail.js';


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


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Patient.findOne({ email });
    let role = 'patient';

    if (!user) {
      user = await Doctor.findOne({ email });
      role = 'doctor';
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, code);

    res.status(200).json({
      message: 'Verification code sent to your email',
      need2FA: true,
      email,
      role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const verify2FACode = async (req, res) => {
  const { email, code } = req.body;

  try {
    let user = await Patient.findOne({ email });
    let role = 'patient';

    if (!user) {
      user = await Doctor.findOne({ email });
      role = 'doctor';
    }

    if (!user || user.twoFactorCode !== code || new Date() > user.twoFactorCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || 'abir', { expiresIn: '1d' });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
