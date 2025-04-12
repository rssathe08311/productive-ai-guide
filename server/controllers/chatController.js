// controllers/chatController.js

const getChatResponse = async (req, res, openai) => {
    try {
      const { messages } = req.body;
  
      // Validate input
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'No messages provided' });
      }
  
      // Call OpenAI API (v4 syntax)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });
  
      const assistantMessage = completion.choices[0].message.content;
      res.status(200).json({ assistantMessage });
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      res.status(500).json({ error: 'OpenAI API error' });
    }
  };
  
  module.exports = { getChatResponse };
  