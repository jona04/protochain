import Validation from '../validation.js';
import type Transaction from './transaction.js';

/**
 * Mocked block class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions: Transaction[];

    /**
     * Creates new mock block
     * @param block Mock Block data
     */
    constructor(block?: Block){
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.transactions = block?.transactions || [] as Transaction[];
        this.hash = block?.hash || this.getHash();
    }

    getHash(): string {
        return this.hash || "abc";
    }

    /**
     * Mock block is valid
     * @param previousHash 
     * @param previsouIndex 
     * @returns 
     */
    isValid(previousHash: string, previsouIndex: number): Validation {
        if (!previousHash || previsouIndex < 0 || this.index < 0) 
            return new Validation(false, "Invalid mock block");

        return new Validation();
    }
}