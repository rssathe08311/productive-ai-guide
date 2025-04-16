const getSpeech = async (req, res, openai) => {
  try {
    const { input, voice = "nova" } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input text is required." });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      input,
      voice,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=speech.mp3",
    });

    res.send(buffer);
  } catch (error) {
    console.error("TTS Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate speech." });
  }
};

module.exports = { getSpeech };
