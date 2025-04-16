// index.js
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

// .env file доторх хувьсагчдыг ачаалах
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Мессеж ирсэнгүй!' });
  }

  try {
    const response = await axios.post(
      'https://api.heygen.com/v1/video/generate',
      {
        script: {
          type: 'text',
          input: message
        },
        avatar_id: process.env.HEYGEN_AVATAR_ID,
        voice_id: process.env.HEYGEN_VOICE_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HEYGEN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const videoUrl = response.data?.data?.video_url;

    if (!videoUrl) {
      return res.status(500).json({ error: 'Видео линк үүссэнгүй' });
    }

    console.log('🎥 Видео үүссэн:', videoUrl);
    return res.status(200).json({ videoUrl });
  } catch (err) {
    console.error('❌ Алдаа:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'HeyGen API дуудах үед алдаа гарлаа' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Norah AI webhook server ажиллаж байна');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер амжилттай ажиллаж байна: http://localhost:${PORT}`);
});
