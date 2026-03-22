# 🍽️ Chat Interativo com IA - Restaurante (MCP Demo)

Projeto didático demonstrando o uso de **MCP (Model Context Protocol)** com **OpenAI Function Calling** para criar um chatbot interativo de atendimento de restaurante.

## 📋 O que é MCP?

MCP (Model Context Protocol) é um padrão para integração entre aplicações e modelos de IA, permitindo que a IA:
- Acesse ferramentas/funções da aplicação
- Execute ações no sistema
- Obtenha dados em tempo real
- Tome decisões baseadas em contexto

Neste projeto, implementamos o fluxo completo de function calling da OpenAI, que segue os princípios do MCP.

## 🎯 Funcionalidades

- ✅ Chat interativo via terminal
- ✅ IA conversacional (atendente de restaurante)
- ✅ Function calling automático
- ✅ Três ferramentas disponíveis:
  - `listarPratos`: mostra o cardápio
  - `buscarPreco`: consulta preço de um prato
  - `fazerPedido`: registra pedido do cliente
- ✅ Histórico de conversa (contexto mantido)
- ✅ Código TypeScript organizado e comentado

## 📁 Estrutura do Projeto

```
MCP/
├── src/
│   ├── index.ts       # Entrada principal, interface readline
│   ├── ia.ts          # Integração OpenAI e fluxo MCP
│   ├── tools.ts       # Definição e execução das tools
│   └── database.ts    # Dados em memória (pratos e pedidos)
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar API Key

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da OpenAI:

```
OPENAI_API_KEY=sk-proj-...
```

### 3. Executar o Projeto

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

## 💬 Exemplo de Uso

```
╔════════════════════════════════════════════════╗
║     🍽️  RESTAURANTE IA - CHAT INTERATIVO      ║
║     Demonstração MCP + OpenAI Function Calling ║
╚════════════════════════════════════════════════╝

💡 Digite sua mensagem e pressione Enter
💡 Digite "sair" para encerrar

──────────────────────────────────────────────────

Você: Oi, quais pratos vocês têm?

[Sistema] Executando função: listarPratos
[Sistema] Argumentos: {}
[Sistema] Resultado: Pratos disponíveis:
- Pizza: R$ 45.90
- Hambúrguer: R$ 32.50
- Lasanha: R$ 38.00
- Salada Caesar: R$ 28.90
- Spaghetti à Carbonara: R$ 42.00
- Risoto de Cogumelos: R$ 48.50

🤖 Atendente: Olá! Temos várias opções deliciosas no nosso cardápio:
- Pizza: R$ 45.90
- Hambúrguer: R$ 32.50
- Lasanha: R$ 38.00
- Salada Caesar: R$ 28.90
- Spaghetti à Carbonara: R$ 42.00
- Risoto de Cogumelos: R$ 48.50

O que você gostaria de pedir hoje?

──────────────────────────────────────────────────

Você: Quero uma pizza

[Sistema] Executando função: fazerPedido
[Sistema] Argumentos: { nomePrato: 'Pizza' }
[Sistema] Resultado: Pedido confirmado! Pizza por R$ 45.90. Será preparado em breve!

🤖 Atendente: Perfeito! Seu pedido de Pizza foi confirmado por R$ 45.90. 
Será preparado em breve! Posso ajudar com mais alguma coisa?

──────────────────────────────────────────────────

Você: sair

👋 Obrigado por usar nosso sistema! Até logo!
```

## 🔧 Fluxo MCP Implementado

1. **Usuário envia mensagem** → sistema adiciona ao histórico
2. **Sistema chama OpenAI** → envia mensagem + tools disponíveis
3. **IA decide** → responder diretamente OU chamar tool
4. **Se IA chamar tool:**
   - Sistema executa a função localmente
   - Resultado é enviado de volta para IA
   - IA processa resultado e gera resposta final
5. **Resposta é exibida** → usuário vê resposta natural
6. **Loop continua** → contexto é mantido

## 📚 Conceitos Demonstrados

- **TypeScript**: Tipagem estática, interfaces
- **OpenAI Function Calling**: Tools/functions
- **MCP Pattern**: Fluxo completo de tool execution
- **Readline**: Interface de terminal interativa
- **Context Management**: Histórico de conversa
- **Environment Variables**: Configuração segura

## 🎓 Para Estudantes

Este projeto foi criado com fins didáticos. Pontos importantes:

1. **Código comentado**: Explicações em português
2. **Estrutura simples**: Fácil de entender
3. **Logs do sistema**: Veja quando tools são chamadas
4. **Exemplo real**: Caso de uso prático

## 📝 Tecnologias

- Node.js
- TypeScript
- OpenAI API (GPT-4)
- ts-node / ts-node-dev
- dotenv
- readline (nativo Node.js)

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` com sua API key!

O `.gitignore` já está configurado para ignorar este arquivo.

## 📄 Licença

MIT - Livre para uso educacional

---

**Desenvolvido para fins didáticos - Demonstração de MCP + OpenAI Function Calling**
