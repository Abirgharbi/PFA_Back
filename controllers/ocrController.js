import axios from "axios";
import fs from "fs";
import FormData from "form-data";

// Fonction qui envoie l'image au service OCR Flask
export async function envoyerImageAuServiceOCR(imagePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));

  // Appel de l'API Flask
  const response = await axios.post("http://127.0.0.1:5000/api/analyze", form, {
    headers: form.getHeaders(),
  });

  return response.data;
}
