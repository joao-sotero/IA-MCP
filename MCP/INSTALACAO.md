# 🚀 Guia de Instalação e Execução

## ⚠️ IMPORTANTE: Execute estes passos em ordem!

### 1️⃣ Navegue até o diretório do projeto
```bash
cd d:\AulaNode\IA-MCP\MCP
```

### 2️⃣ Instale as dependências
```bash
npm install
```

**Isso vai instalar:**
- `openai` - SDK da OpenAI
- `dotenv` - Gerenciamento de variáveis de ambiente
- `typescript` - Compilador TypeScript
- `ts-node` - Executor TypeScript
- `ts-node-dev` - Executor com hot reload
- `@types/node` - Definições de tipos do Node.js

### 3️⃣ Configure a API Key da OpenAI

**Opção A: Copiar o arquivo de exemplo**
```bash
copy .env.example .env
```

**Opção B: Criar manualmente**
Crie um arquivo `.env` na raiz do projeto com:
```
OPENAI_API_KEY=sk-proj-sua_chave_aqui
```

🔑 **Obtenha sua chave em:** https://platform.openai.com/api-keys

### 4️⃣ Execute o projeto

**Modo desenvolvimento (recomendado):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

### ✅ Teste se está funcionando

Após executar, você deve ver:
```
╔════════════════════════════════════════════════╗
║     🍽️  RESTAURANTE IA - CHAT INTERATIVO      ║
║     Demonstração MCP + OpenAI Function Calling ║
╚════════════════════════════════════════════════╝

💡 Digite sua mensagem e pressione Enter
💡 Digite "sair" para encerrar

──────────────────────────────────────────────────

Você: 
```

### 📝 Exemplo de teste rápido

Digite:
```
Você: oi
```

A IA deve responder algo como:
```
🤖 Atendente: Olá! Bem-vindo ao nosso restaurante! 
Como posso ajudá-lo hoje? Gostaria de ver nosso cardápio?
```

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module 'openai'"
**Solução:** Execute `npm install`

### Erro: "OPENAI_API_KEY não configurada"
**Solução:** Crie o arquivo `.env` com sua chave válida

### Erro: "Invalid API Key"
**Solução:** Verifique se sua chave está correta e válida no site da OpenAI

### TypeScript mostrando erros no VSCode
**Solução:** Execute `npm install` primeiro. Os erros desaparecem após instalar @types/node

---

## 📚 Estrutura Completa

```
MCP/
├── src/
│   ├── index.ts       ✅ Pronto
│   ├── ia.ts          ✅ Pronto
│   ├── tools.ts       ✅ Pronto
│   └── database.ts    ✅ Pronto
├── package.json       ✅ Pronto
├── tsconfig.json      ✅ Pronto
├── .env.example       ✅ Pronto
├── .gitignore         ✅ Pronto
├── README.md          ✅ Pronto
└── INSTALACAO.md      ✅ Este arquivo
```

**Status:** Projeto completo e pronto para uso! 🎉

Execute `npm install` e comece a usar!
