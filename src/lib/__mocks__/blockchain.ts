import Block from "./block.js";
import Validation from "../validation.js";
import type BlockInfo from "../blockInfo.js";
import Transaction from "../transaction.js";
import TransactionType from "../transaction_type.js";

/**
 * Mocked Blockchain class
 * Some comments
 */
export default class Blockchain {
    blocks: [Block, ...Block[]];
    nextIndex: number = 0;

    /**
     * Creates a new mock blockchain
     */
    constructor(){
        this.blocks = [new Block(
            {
                index: 0, 
                hash: "abc", 
                previousHash: "", 
                transactions: [new Transaction({data:"tx1", type:TransactionType.FEE} as Transaction)], 
                timestamp: Date.now()
            } as Block)
        ];
        this.nextIndex++;
    }

    getLastBlock(): Block {
        const last = this.blocks[this.blocks.length-1];
        if (!last) throw new Error("Empty blockchain");
        return last;
    }

    getDifficulty(): number {
        return Math.ceil(this.blocks.length/5);
    }

    addBlock(block: Block): Validation {
        if(block.index < 0) return new Validation(false, "Invalid block");

        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    isValid(): Validation {
        return new Validation();
    }

    getFeePerTx(): number {
        return 1;
    }

    getNextBlock(): BlockInfo {
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 5;
        return {
            transactions: [new Transaction({
                data: "Block"
            } as Transaction)],
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo
    }
}