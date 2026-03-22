/**
 * Definições e implementações das tools/funções que a IA pode chamar
 * Seguindo o padrão MCP (Model Context Protocol)
 */

import { pratos, pedidos } from './database';

/**
 * Definição das tools no formato esperado pela OpenAI
 * Cada tool tem nome, descrição e parâmetros
 */
export const toolDefinitions = [
    {
        type: "function" as const,
        function: {
            name: "listarPratos",
            description: "Lista todos os pratos disponíveis no cardápio do restaurante com seus preços",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    },
    {
        type: "function" as const,
        function: {
            name: "buscarPreco",
            description: "Busca o preço de um prato específico pelo nome",
            parameters: {
                type: "object",
                properties: {
                    nomePrato: {
                        type: "string",
                        description: "Nome do prato para buscar o preço (ex: Pizza, Hambúrguer)"
                    }
                },
                required: ["nomePrato"]
            }
        }
    },
    {
        type: "function" as const,
        function: {
            name: "fazerPedido",
            description: "Registra o pedido de um prato para o cliente",
            parameters: {
                type: "object",
                properties: {
                    nomePrato: {
                        type: "string",
                        description: "Nome do prato que o cliente deseja pedir"
                    }
                },
                required: ["nomePrato"]
            }
        }
    }
];

/**
 * Implementação das funções/tools
 * Cada função retorna um resultado em formato de string
 */

function listarPratos(): string {
    const listaPratos = pratos.map(p => 
        `- ${p.nome}: R$ ${p.preco.toFixed(2)}`
    ).join('\n');
    
    return `Pratos disponíveis:\n${listaPratos}`;
}

function buscarPreco(nomePrato: string): string {
    // Busca case-insensitive
    const prato = pratos.find(p => 
        p.nome.toLowerCase() === nomePrato.toLowerCase()
    );
    
    if (prato) {
        return `O preço do ${prato.nome} é R$ ${prato.preco.toFixed(2)}`;
    }
    
    return `Desculpe, não encontrei o prato "${nomePrato}" no cardápio.`;
}

function fazerPedido(nomePrato: string): string {
    // Busca case-insensitive
    const prato = pratos.find(p => 
        p.nome.toLowerCase() === nomePrato.toLowerCase()
    );
    
    if (prato) {
        // Registra o pedido
        pedidos.push({ 
            prato: prato.nome, 
            timestamp: new Date() 
        });
        
        return `Pedido confirmado! ${prato.nome} por R$ ${prato.preco.toFixed(2)}. Será preparado em breve!`;
    }
    
    return `Desculpe, não consegui registrar o pedido. O prato "${nomePrato}" não está no cardápio.`;
}

/**
 * Executor de tools
 * Recebe o nome da função e os argumentos, executa e retorna o resultado
 */
export function executeTool(functionName: string, args: any): string {
    switch (functionName) {
        case "listarPratos":
            return listarPratos();
        
        case "buscarPreco":
            return buscarPreco(args.nomePrato);
        
        case "fazerPedido":
            return fazerPedido(args.nomePrato);
        
        default:
            return `Erro: Função ${functionName} não encontrada`;
    }
}
