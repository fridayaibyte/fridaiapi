// File: api/friday-chat.js

import { Together } from 'together-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Middleware-style CORS handling
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://hellofriday.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const handler = async (req, res) => {
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
    res.status(200).json({ response: aiMessage });
  } catch (error) {
    console.error('Error from Together API:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
};

export default allowCors(handler);
