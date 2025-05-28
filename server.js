import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://hellofriday.netlify.app',
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

app.post('/api/friday-chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: 'You are Friday, a witty and emotionally intelligent assistant.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, no response received.';
    res.json({ response: aiMessage });

  } catch (error) {
    console.error('Together API Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
