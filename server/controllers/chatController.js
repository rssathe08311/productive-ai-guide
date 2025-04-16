// controllers/chatController.js

exports.getChatResponse = async (req, res, openai) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt must be a string' });
      }
  
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for student AI literacy.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      });
  
      res.json({ result: completion.choices[0].message.content });
    } catch (error) {
      console.error('OpenAI error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  };
  
  