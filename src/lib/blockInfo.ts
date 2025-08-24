import type Transaction from "./transaction.js";

export default interface BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    transactions: Transaction[];
}