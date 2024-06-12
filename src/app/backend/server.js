const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for the Angular frontend

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const OCR_API_URL = 'https://hack24-verify.cognitiveservices.azure.com/vision/v3.2/ocr?detectOrientation=true';
const OCR_API_KEY = 'dcadc12c28d74ddea2e86826907b0c0b'; // Replace with your actual Azure API key

app.post('/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const file = req.file.buffer;

    const headers = {
      'Ocp-Apim-Subscription-Key': OCR_API_KEY,
      'Content-Type': 'application/octet-stream'
    };

    const response = await axios.post(OCR_API_URL, file, { headers });
    return res.status(200).send(response.data);
  } catch (error) {
    console.error('Error analyzing file:', error);
    return res.status(500).send('Error analyzing file.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
