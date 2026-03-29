# 🐛 Guia de Debug

## 🎯 Como Debugar o Projeto

Este projeto está configurado com dois métodos de debug no VS Code.

## 📋 Configurações Criadas

### 1. `.vscode/launch.json` - Configurações de Debug

Duas opções de debug disponíveis:

- **Debug Restaurante Chat**: Usando ts-node/esm
- **Debug com ts-node**: Método alternativo

### 2. `.vscode/tasks.json` - Tarefas NPM

Atalhos para executar:

- `npm run dev`
- `npm start`
- `npm install`

### 3. `.vscode/settings.json` - Configurações do Workspace

- Formatação automática ao salvar
- TypeScript workspace configurado
- Exclusão de node_modules nas buscas

## 🚀 Como Usar o Debugger

### Método 1: Via Menu Debug

1. Abra o arquivo que deseja debugar (ex: `src/index.ts` ou `src/ia.ts`)
2. Clique na margem esquerda do editor para adicionar **breakpoints** (bolinhas vermelhas)
3. Pressione `F5` ou vá em **Run → Start Debugging**
4. Escolha uma das configurações:
   - "Debug Restaurante Chat"
   - "Debug com ts-node"
5. O programa irá parar nos breakpoints que você definiu

### Método 2: Via Painel de Debug

1. Clique no ícone de **Debug** na barra lateral esquerda (🐛)
2. No topo do painel, escolha a configuração de debug
3. Clique no botão **▶️ Play** verde
4. Use o terminal integrado para interagir com o chat

## 🔍 Recursos do Debugger

### Breakpoints

- **Clique** na margem esquerda do código para adicionar/remover
- **Clique com botão direito** para breakpoints condicionais

### Controles de Debug (barra superior durante debug)

- **Continue (F5)**: Continua até o próximo breakpoint
- **Step Over (F10)**: Executa a linha atual e vai para a próxima
- **Step Into (F11)**: Entra dentro da função
- **Step Out (Shift+F11)**: Sai da função atual
- **Restart (Ctrl+Shift+F5)**: Reinicia o debug
- **Stop (Shift+F5)**: Para o debug

### Painéis Úteis Durante Debug

1. **VARIABLES**: Vê valores de todas as variáveis
2. **WATCH**: Monitora expressões específicas
3. **CALL STACK**: Vê a pilha de chamadas
4. **BREAKPOINTS**: Gerencia todos os breakpoints

## 💡 Dicas de Debug

### Debugar Chamadas da OpenAI

Adicione breakpoint em `src/ia.ts`:

- Linha ~52: Antes de chamar a API
- Linha ~62: Quando detecta tool_calls
- Linha ~75: Após executar tool

### Debugar Tools

Adicione breakpoint em `src/tools.ts`:

- Linha ~112: No switch do executeTool
- Dentro de cada função: listarPratos, buscarPreco, fazerPedido

### Debugar Entrada do Usuário

Adicione breakpoint em `src/index.ts`:

- Linha ~50: Quando usuário digita algo
- Linha ~69: Antes de exibir resposta da IA

## 🔧 Troubleshooting

### Debug não inicia?

1. Certifique-se que instalou as dependências: `npm install`
2. Verifique se o arquivo `.env` existe com a API key
3. Feche e reabra o VS Code

### Breakpoints não funcionam?

1. Certifique-se que salvou o arquivo (Ctrl+S)
2. Verifique se está usando a configuração correta de debug
3. Tente usar "Debug com ts-node" se a primeira opção falhar

### Console não aparece?

- Os debuggers estão configurados para `"console": "integratedTerminal"`
- O terminal integrado do VS Code será aberto automaticamente

## 📚 Exemplo Prático de Debug

### Debugar o Fluxo Completo de Tool Calling

1. Adicione breakpoints em:

   ```
   src/ia.ts linha 52  → Antes de chamar OpenAI
   src/ia.ts linha 70  → Quando detecta tool_call
   src/tools.ts linha 112 → Executor de tools
   src/index.ts linha 69 → Antes de exibir resposta
   ```
2. Inicie o debug (F5)
3. Digite no chat: "quero uma pizza"
4. O debugger irá parar em cada breakpoint, permitindo:

   - Ver o conteúdo da mensagem
   - Ver quando a IA decide chamar a tool
   - Ver os parâmetros passados
   - Ver o resultado retornado
5. Use **F10** para avançar linha por linha
