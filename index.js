import express from 'express';
import mongoose from 'mongoose';
import patientRoutes from './routes/PatientRoute.js';
import doctorRoutes from './routes/DoctorRoute.js';
import authRoutes from './routes/AuthRoute.js';
import ocrRoutes from './routes/OcrRoute.js'
import dotenv from 'dotenv'; // Import dotenv for environment variables
import cors from 'cors';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
