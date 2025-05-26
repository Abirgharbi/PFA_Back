import express from 'express';
import mongoose from 'mongoose';
import patientRoutes from './routes/PatientRoute.js';
import doctorRoutes from './routes/DoctorRoute.js';
import authRoutes from './routes/AuthRoute.js';
import ocrRoutes from './routes/OcrRoute.js';
import reportRoutes from './routes/ReportRoute.js';
import report from './routes/report.js'
import dotenv from 'dotenv'; // Import dotenv for environment variables
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Créez l'équivalent de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: 'http://localhost:8080', // Spécifiez explicitement l'origine frontend
  credentials: true, // Autorisez les credentials
  optionsSuccessStatus: 200 // Pour les navigateurs anciens
};

app.use(cors(corsOptions));
app.use(express.json());
// Routes


app.use('/api', report);
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/uploads', reportRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
