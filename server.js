import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Together } from '@togetherai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Friday backend is alive!');
});

app.post('/api/friday-chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing user message' });
  }

  try {
    const response = await together.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        {
          role: 'system',
          content:
            'You are Friday, a witty Hinglish-speaking chatbot with emotional intelligence and sarcasm.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0]?.message?.content;
    res.json({ response: reply || 'Friday had no reply' });
  } catch (err) {
    console.error('Error from Together API:', err);
    res.status(500).json({ error: 'Something went wrong with Friday' });
  }
});

app.listen(port, () => {
  console.log(`✅ Friday backend running on http://localhost:${port}`);
});
