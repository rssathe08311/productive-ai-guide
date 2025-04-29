// image/chatController.js
const getImageResponse = async (req, res, openai) => {
    try {
      const { prompt, n, size } = req.body;
  
      const response = await openai.images.generate({
        model: "dall-e-3", 
        prompt,
        n: n || 1,
        size: size || "1024x1024",
      });
  
      const imageData = response.data;
  
      res.status(200).json({
        images: imageData.map(img => ({ url: img.url })),
      });
    } catch (error) {
      console.error("Error generating image:", error?.response?.data || error.message);
      res.status(500).json({
        error: error?.response?.data?.error?.message || "Something went wrong",
      });
    }
  };
  module.exports = { getImageResponse };