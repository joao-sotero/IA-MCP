/**
 * Arquivo principal da aplicação
 * Cria um chat interativo no terminal usando readline
 */

import * as readline from 'readline';
import { processarMensagem } from './ia';

// Cria interface readline para entrada/saída no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Exibe mensagem de boas-vindas
 */
function exibirBoasVindas(): void {
    console.clear();
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║     🍽️  RESTAURANTE IA - CHAT INTERATIVO      ║');
    console.log('║     Demonstração MCP + OpenAI Function Calling ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log('💡 Digite sua mensagem e pressione Enter');
    console.log('💡 Digite "sair" para encerrar\n');
    console.log('─'.repeat(50) + '\n');
}

/**
 * Função principal do chat
 * Loop que lê entrada do usuário, processa com IA e exibe resposta
 */
async function iniciarChat(): Promise<void> {
    exibirBoasVindas();

    // Função recursiva que mantém o chat ativo
    const pergunta = async () => {
        rl.question('Você: ', async (entrada: string) => {
            const mensagem = entrada.trim();

            // Comando para sair
            if (mensagem.toLowerCase() === 'sair') {
                console.log('\n👋 Obrigado por usar nosso sistema! Até logo!\n');
                rl.close();
                return;
            }

            // Ignora entradas vazias
            if (!mensagem) {
                pergunta();
                return;
            }

            try {
                // Processa a mensagem com a IA
                const resposta = await processarMensagem(mensagem);
                
                // Exibe a resposta da IA
                console.log(`\n🤖 Atendente: ${resposta}\n`);
                console.log('─'.repeat(50) + '\n');
                
            } catch (error) {
                console.error('\n❌ Erro ao processar mensagem:', error);
                console.log('\n');
            }

            // Continua o loop do chat
            pergunta();
        });
    };

    // Inicia o loop
    pergunta();
}

// Inicia a aplicação
iniciarChat().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
});
