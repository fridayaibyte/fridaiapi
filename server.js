import axios from 'axios';

app.post('/api/friday-chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: 'You are Friday, a witty and emotionally intelligent assistant.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices?.[0]?.message?.content || 'No response';
    res.json({ response: aiMessage });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'AI response failed' });
  }
});
