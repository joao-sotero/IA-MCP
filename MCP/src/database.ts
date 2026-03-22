/**
 * Banco de dados em memória do restaurante
 * Simula uma base de dados com pratos disponíveis
 */

export interface Prato {
    id: number;
    nome: string;
    preco: number;
}

// Lista de pratos disponíveis no restaurante
export const pratos: Prato[] = [
    { id: 1, nome: "Pizza", preco: 45.90 },
    { id: 2, nome: "Hambúrguer", preco: 32.50 },
    { id: 3, nome: "Lasanha", preco: 38.00 },
    { id: 4, nome: "Salada Caesar", preco: 28.90 },
    { id: 5, nome: "Spaghetti à Carbonara", preco: 42.00 },
    { id: 6, nome: "Risoto de Cogumelos", preco: 48.50 }
];

// Armazena os pedidos realizados (em memória)
export const pedidos: { prato: string; timestamp: Date }[] = [];
