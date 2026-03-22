# AI Streaming API

API simples de integração com IA que responde perguntas com streaming de resposta em tempo real (como o ChatGPT).

## 🚀 Funcionalidades

- ✅ Streaming de resposta em tempo real usando Server-Sent Events (SSE)
- ✅ Integração com OpenAI GPT
- ✅ **Histórico de conversação mantido em memória no servidor**
- ✅ Sistema de sessões automático
- ✅ Limpeza automática de conversas antigas (1 hora)
- ✅ CORS habilitado
- ✅ TypeScript

## 📋 Pré-requisitos

- Node.js 18+
- Chave da API OpenAI

## 🔧 Instalação

1. Clone o repositório e navegue até o diretório:
```bash
cd ai-streaming-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione sua chave da API OpenAI:
```env
OPENAI_API_KEY=sk-...
PORT=3000
```

## 🎮 Como usar

### Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

### Compilar para produção:
```bash
npm run build
npm start
```

## 📡 Endpoints da API

### 1. Health Check
```
GET /health
```

**Resposta:**
```json
{
  "status": "ok",
  "message": "AI Streaming API is running",
  "activeConversations": 3
}
```

### 2. Chat com Histórico em Memória (Streaming)
```
POST /api/chat
```

**Body:**
```json
{
  "message": "Explique o que é TypeScript",
  "sessionId": "uuid-opcional",
  "model": "gpt-4.1",
  "systemPrompt": "Você é um assistente útil"
}
```

**Parâmetros:**
- `message` (obrigatório): A mensagem do usuário
- `sessionId` (opcional): ID da sessão para manter histórico. Se não enviado, uma nova sessão é criada
- `model` (opcional): Modelo da OpenAI (padrão: `gpt-4.1`)
- `systemPrompt` (opcional): Prompt de sistema para nova sessão

**Resposta:** Stream de eventos (SSE)
```
data: {"sessionId":"abc-123-def"}

data: {"content":"Type"}

data: {"content":"Script"}

data: {"content":" é"}

...

data: {"done":true}
```

**Como funciona o histórico:**
- O servidor mantém todas as mensagens em memória usando o `sessionId`
- A cada nova mensagem, todo o histórico é enviado para a IA
- A IA entende o contexto completo da conversa
- Sessões antigas (>1 hora) são automaticamente removidas

### 3. Obter Histórico da Conversa
```
GET /api/chat/:sessionId
```

**Resposta:**
```json
{
  "sessionId": "abc-123-def",
  "messages": [
    { "role": "user", "content": "Olá!" },
    { "role": "assistant", "content": "Olá! Como posso ajudar?" }
  ],
  "createdAt": "2026-03-22T10:00:00.000Z",
  "lastUpdated": "2026-03-22T10:05:00.000Z"
}
```

### 4. Deletar Conversa
```
DELETE /api/chat/:sessionId
```

**Resposta:**
```json
{
  "message": "Conversation deleted successfully"
}
```

## 🌐 Exemplo de Cliente HTML

Abra o arquivo `client.html` no navegador para testar a API com interface gráfica.

**Funcionalidades do cliente:**
- ✅ Interface moderna estilo ChatGPT
- ✅ Streaming em tempo real
- ✅ Memória de conversação automática
- ✅ Botão para iniciar nova conversa
- ✅ Indicadores visuais de loading e streaming

O cliente mantém automaticamente o `sessionId` em memória e envia em cada requisição, permitindo que a IA lembre do contexto da conversa.

## 🧪 Testando com cURL

```bash
# Primeira mensagem (cria uma nova sessão)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, como você está?"}' \
  --no-buffer

# Segunda mensagem (usando o sessionId retornado)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Sobre o que conversamos?", "sessionId": "abc-123-def"}' \
  --no-buffer

# Ver histórico
curl http://localhost:3000/api/chat/abc-123-def

# Deletar conversa
curl -X DELETE http://localhost:3000/api/chat/abc-123-def
```

## 📚 Tecnologias Utilizadas

- **Express**: Framework web
- **OpenAI**: Integração com GPT
- **TypeScript**: Tipagem estática
- **Server-Sent Events (SSE)**: Streaming em tempo real
- **CORS**: Suporte cross-origin
- **Sistema de Sessões**: Histórico mantido em memória

## 🔒 Segurança

⚠️ **Importante**: Nunca commit sua chave da API OpenAI para repositórios públicos. Sempre use variáveis de ambiente.

## 📄 Licença

ISC
