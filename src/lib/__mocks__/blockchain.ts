import Block from "./block.js";
import Validation from "../validation.js";
import type BlockInfo from "../blockInfo.js";
import Transaction from "./transaction.js";
import TransactionType from "../transaction_type.js";
import type TransactionSearch from "../transactionSearch.js";
import TransactionInput from "./transactionInput.js";

/**
 * Mocked Blockchain class
 * Some comments
 */
export default class Blockchain {
    blocks: [Block, ...Block[]];
    nextIndex: number = 0;
    mempool: Transaction[];

    /**
     * Creates a new mock blockchain
     */
    constructor(){
        this.mempool = [];

        this.blocks = [new Block(
            {
                index: 0, 
                hash: "abc", 
                previousHash: "", 
                transactions: [new Transaction({txInput: new TransactionInput(), type:TransactionType.FEE} as Transaction)], 
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

    addTransaction(transaction: Transaction) : Validation {
            const validation = transaction.isValid();
            if(!validation.success)
                return new Validation(false, "Invalid tx: "+validation.message);
            
            if(this.mempool.some(tx=>tx.hash === transaction.hash))
                return new Validation(false, "Duplicated tx in mempool.")
    
            this.mempool.push(transaction);
            return new Validation(true, transaction.hash);
        }
    
        
    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.hash === hash);
    }

    getTransaction(hash: string): TransactionSearch {
            const mempoolIndex =  this.mempool.findIndex(b => b.hash === hash);
            if(mempoolIndex !== -1)
                return {
                    mempoolIndex,
                    transaction: this.mempool[mempoolIndex]
                } as TransactionSearch
    
            const blockIndex = this.blocks.findIndex(b=>b.transactions.some(tx=>tx.hash === hash));
            if(blockIndex !== -1)
                return {
                    blockIndex,
                    transaction: this.blocks[blockIndex]?.transactions.find(tx=>tx.hash === hash)
                } as TransactionSearch;
            
            return { blockIndex: -1, mempoolIndex: -1} as TransactionSearch
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
                txInput: new TransactionInput(),
            } as Transaction)],
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo
    }
}