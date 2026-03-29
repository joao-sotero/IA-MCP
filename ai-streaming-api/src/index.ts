import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

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

// Armazenamento do thread e assistant
let assistantId: string | null = null;
let threadId: string | null = null;

// Diretório para arquivos temporários
const TEMP_DIR = path.join(__dirname, '../temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Tool definition para o GPT decidir quando usar Code Interpreter
const tools = [
  {
    type: "function" as const,
    function: {
      name: "use_code_interpreter",
      description: "Use esta ferramenta quando precisar executar código Python, criar arquivos (Excel, CSV, PDF), gerar gráficos, fazer cálculos complexos ou analisar dados estruturados.",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Breve explicação do que será feito com o Code Interpreter"
          }
        },
        required: ["reason"]
      }
    }
  }
];

// Handler para chat com detecção inteligente
async function handleSmartChat(message: string, res: Response) {
  // Adiciona mensagem do usuário ao histórico
  conversationHistory.push({ role: 'user', content: message });

  // Primeira tentativa: oferece a tool ao GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: conversationHistory,
    tools: tools,
    tool_choice: 'auto',
  });

  const responseMessage = response.choices[0].message;

  // Verifica se o GPT quer usar Code Interpreter
  if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    
    // Remove a última mensagem do histórico (vamos usar o Code Interpreter ao invés)
    conversationHistory.pop();
    
    // Envia feedback para o usuário
    res.write(`data: ${JSON.stringify({ type: 'text', content: `🔧 Executando Code Interpreter...\n\n` })}\n\n`);
    
    // Redireciona para Code Interpreter - NÃO fecha a resposta aqui
    await handleCodeInterpreterChat(message, res);
    
    // handleCodeInterpreterChat vai fechar a resposta
  } else {
    // Resposta normal - faz streaming da resposta já gerada
    const content = responseMessage.content || '';
    
    // Envia a resposta em chunks simulados para manter o padrão
    const chunkSize = 5;
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
    }
    
    // Adiciona resposta da IA ao histórico
    conversationHistory.push({ role: 'assistant', content });

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  }
}

// Handler para Code Interpreter
async function handleCodeInterpreterChat(message: string, res: Response) {
  if (!assistantId) {
    const assistant = await openai.beta.assistants.create({
      name: "Code Interpreter Assistant",
      instructions: "Você é um assistente que executa código Python e gera arquivos. Quando o usuário pedir para criar arquivos, gerar gráficos ou manipular dados, execute o código Python IMEDIATAMENTE usando o Code Interpreter. Não explique, apenas execute e gere os arquivos solicitados.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    });
    assistantId = assistant.id;
  }

  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  const stream = await openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  const fileIds: string[] = [];

  stream.on('textDelta', (textDelta) => {
    const content = textDelta.value || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ type: 'text', content })}\n\n`);
    }
  });

  stream.on('messageDone', async (message) => {
    for (const content of message.content) {
      if (content.type === 'image_file') {
        fileIds.push(content.image_file.file_id);
      }
      
      if (content.type === 'text' && content.text?.annotations) {
        for (const annotation of content.text.annotations) {
          if (annotation.type === 'file_path') {
            fileIds.push(annotation.file_path.file_id);
          } else if (annotation.type === 'file_citation') {
            fileIds.push(annotation.file_citation.file_id);
          }
        }
      }
    }

    if (fileIds.length > 0) {
      res.write(`data: ${JSON.stringify({ type: 'files', fileIds })}\n\n`);
    }
  });

  stream.on('end', () => {
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  });

  stream.on('error', (error) => {
    console.error('❌ Stream error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  });
}

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Configura SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Usa detecção inteligente com function calling
    await handleSmartChat(message, res);

  } catch (error: any) {
    console.error('Error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
});

// Limpar histórico e thread
app.delete('/api/chat', async (req: Request, res: Response) => {
  conversationHistory.length = 0;
  
  // Resetar thread se existir
  if (threadId) {
    try {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    } catch (error) {
      console.error('Error resetting thread:', error);
    }
  }
  
  res.json({ message: 'Histórico e thread limpos' });
});

// Download de arquivo gerado pelo Code Interpreter
app.get('/api/download/:fileId', async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    // Buscar informações do arquivo
    const file = await openai.files.retrieve(fileId);
    
    // Fazer download do conteúdo
    const response = await openai.files.content(fileId);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Extrair apenas o nome do arquivo (sem o caminho do sandbox)
    const originalFileName = file.filename || `file_${fileId}`;
    const fileName = path.basename(originalFileName);
    const filePath = path.join(TEMP_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    // Enviar para download
    res.download(filePath, fileName, (err) => {
      // Limpar arquivo após download
      if (err) {
        console.error('Download error:', err);
      }
      // Não deletar imediatamente para permitir múltiplos downloads
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 60000); // Limpar após 1 minuto
    });

  } catch (error: any) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server: http://localhost:${port}`);
});
