import { HeyGen } from 'heygen'; // HeyGen module импортлох

const heygen = new HeyGen({
  apiKey: process.env.HEYGEN_API_KEY, // Таны API key
  avatarId: process.env.HEYGEN_AVATAR_ID, // Таны Avatar ID
  voiceId: process.env.HEYGEN_VOICE_ID // Таны Voice ID
});

app.post('/webhook', async (req, res) => {
  const message = req.body.message;

  try {
    // HeyGen-ээс Avatar-ын хариу авах
    const avatarResponse = await heygen.createVideo({
      text: message, // Мессеж
      avatarId: process.env.HEYGEN_AVATAR_ID, // Avatar ID
      voiceId: process.env.HEYGEN_VOICE_ID // Voice ID
    });

    res.status(200).send({
      message: "Avatar successfully created",
      videoUrl: avatarResponse.videoUrl // Хариуд видео URL
    });

    console.log("Avatar response:", avatarResponse); // Лог дээр хариуг харах
  } catch (error) {
    console.error("Error creating avatar:", error);
    res.status(500).send("Failed to create avatar");
  }
});
