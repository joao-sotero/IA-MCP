/**
 * Módulo de integração com a API da OpenAI
 * Gerencia a comunicação com a IA e o fluxo MCP
 */

import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { toolDefinitions, executeTool } from './tools';

// Carrega variáveis de ambiente ANTES de usar
dotenv.config();

// Valida se a API key está configurada
if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ ERRO: OPENAI_API_KEY não configurada!');
    console.error('Por favor, crie um arquivo .env na raiz do projeto com:');
    console.error('OPENAI_API_KEY=sua_chave_aqui\n');
    process.exit(1);
}

// Inicializa o cliente OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Prompt do sistema que define o comportamento da IA
const SYSTEM_PROMPT = `Você é um atendente simpático e prestativo de um restaurante.
Seu objetivo é ajudar os clientes a:
- Conhecer o cardápio
- Escolher pratos
- Fazer pedidos

Seja conversacional, amigável e natural. Não fale de forma técnica ou robótica.
Sugira pratos quando apropriado e ajude o cliente a tomar decisões.
Use as ferramentas disponíveis quando precisar consultar informações ou fazer ações.`;

// Tipo para mensagens do chat
type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// Histórico de conversação (contexto)
let conversationHistory: Message[] = [
    { role: "system", content: SYSTEM_PROMPT }
];

/**
 * Função principal que processa uma mensagem do usuário
 * Implementa o fluxo completo do MCP:
 * 1. Envia mensagem + tools para IA
 * 2. Detecta se IA quer chamar tool
 * 3. Executa tool
 * 4. Retorna resultado para IA
 * 5. Obtém resposta final
 */
export async function processarMensagem(mensagemUsuario: string): Promise<string> {
    try {
        // Adiciona mensagem do usuário ao histórico
        conversationHistory.push({
            role: "user",
            content: mensagemUsuario
        });

        // PASSO 1: Primeira chamada à IA com as tools disponíveis
        let response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: conversationHistory,
            tools: toolDefinitions,
            tool_choice: "auto" // IA decide se usa ou não uma tool
        });

        let responseMessage = response.choices[0].message;

        // PASSO 2: Verificar se a IA quer chamar alguma tool
        while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            // Adiciona a resposta da IA (com tool_calls) ao histórico
            conversationHistory.push(responseMessage);

            // PASSO 3: Executar cada tool solicitada
            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                console.log(`\n[Sistema] Executando função: ${functionName}`);
                console.log(`[Sistema] Argumentos:`, functionArgs);

                // Executa a tool e obtém o resultado
                const resultado = executeTool(functionName, functionArgs);
                
                console.log(`[Sistema] Resultado: ${resultado}\n`);

                // PASSO 4: Adiciona o resultado da tool ao histórico
                conversationHistory.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: resultado
                });
            }

            // PASSO 5: Chama a IA novamente com os resultados das tools
            response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: conversationHistory,
                tools: toolDefinitions,
                tool_choice: "auto"
            });

            responseMessage = response.choices[0].message;
        }

        // Adiciona a resposta final ao histórico
        conversationHistory.push(responseMessage);

        // Retorna a resposta da IA
        return responseMessage.content || "Desculpe, não consegui processar sua mensagem.";

    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
        return "Desculpe, ocorreu um erro. Tente novamente.";
    }
}

/**
 * Reseta o histórico de conversação (útil para começar novo chat)
 */
export function resetarConversa(): void {
    conversationHistory = [
        { role: "system", content: SYSTEM_PROMPT }
    ];
}
