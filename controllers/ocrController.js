import axios from 'axios';


export async function envoyerImageAuServiceOCR(image) {
  try {
    const response = await axios.post('http://127.0.0.1:5000/ocr', {
      image: image
    });

    return response.data;
  } catch (error) {
    console.error('Erreur avec le service OCR Flask:', error.message);
    throw error;
  }
}


