import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.heygen.com/v1/video.create",
      {
        avatar_id: process.env.HEYGEN_AVATAR_ID,
        voice_id: process.env.HEYGEN_VOICE_ID,
        script: {
          type: "text",
          input: "userMessage",
        },
        test: true,
      },
      {
        headers: {
          "X-Api-Key": process.env.HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const videoId = response.data.data.video_id;

    // Now check video status every few seconds
    const checkVideoStatus = async () => {
      const statusRes = await axios.get(
        `https://api.heygen.com/v1/video.status?video_id=${videoId}`,
        {
          headers: {
            "X-Api-Key": process.env.HEYGEN_API_KEY,
          },
        }
      );

      if (statusRes.data.data.status === "completed") {
        return statusRes.data.data.video_url;
      } else {
        return new Promise((resolve) => {
          setTimeout(async () => {
            const url = await checkVideoStatus();
            resolve(url);
          }, 4000); // 4 секунд тутна
        });
      }
    };

    const videoUrl = await checkVideoStatus();

    res.json({
      video: videoUrl,
      message: "Видео амжилттай үүсгэгдлээ!",
    });
  } catch (err) {
    console.error("Алдаа:", err.message);
    res.status(500).json({ error: "Видео үүсгэх үед алдаа гарлаа." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер амжилттай ажиллаж байна: http://localhost:${PORT}`);
});