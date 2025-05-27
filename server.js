import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Together } from 'together-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

app.post('/api/friday-chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await together.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: 'You are Friday, a witty and emotionally intelligent assistant.' },
        { role: 'user', content: message },
      ],
    });

    const aiMessage = response.choices[0]?.message?.content || 'Sorry, no response received.';
    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Error from Together API:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
