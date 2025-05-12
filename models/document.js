import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  name: String,
  textExtract: String, // Text extracted from the document
  uploadDate: { type: Date, default: Date.now },
  imageUrl: String, // URL for the image associated with the document
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Reference to the patient
});

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
