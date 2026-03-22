import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Armazenamento simples do histórico
const conversationHistory: Array<any> = [];

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Adiciona mensagem do usuário ao histórico
    conversationHistory.push({ role: 'user', content: message });

    // Configura SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Envia para IA com histórico completo
    const stream = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: conversationHistory,
      stream: true,
    });

    let assistantResponse = '';

    // Envia chunks
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        assistantResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Adiciona resposta da IA ao histórico
    conversationHistory.push({ role: 'assistant', content: assistantResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error: any) {
    console.error('Error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

// Limpar histórico
app.delete('/api/chat', (req: Request, res: Response) => {
  conversationHistory.length = 0;
  res.json({ message: 'Histórico limpo' });
});

app.listen(port, () => {
  console.log(`🚀 Server: http://localhost:${port}`);
});
