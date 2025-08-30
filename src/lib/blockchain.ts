import Block from "./block.js";
import type BlockInfo from "./blockInfo.js";
import Transaction from "./transaction.js";
import TransactionType from "./transaction_type.js";
import TransactionInput from "./transactionInput.js";
import type TransactionSearch from "./transactionSearch.js";
import Validation from "./validation.js";

/**
 * Blockchain class
 * Some comments
 */
export default class Blockchain {
    blocks: [Block, ...Block[]];
    mempool: Transaction[];
    nextIndex: number = 0;

    static readonly DIFFICULTY_FACTOR: number = 5;
    static readonly MAX_DIFFICULTY: number = 62;
    static readonly TX_PER_BLOCK: number = 2;

    /**
     * Creates a new blockchain
     */
    constructor(){
        this.mempool = [];
        this.blocks = [new Block(
            {
                index: this.nextIndex, 
                previousHash: "", 
                transactions:[
                    new Transaction(
                        {
                            type: TransactionType.FEE,
                            txInput: new TransactionInput
                        } as Transaction)]
            } as Block)];
        this.nextIndex++;
    }

    getLastBlock(): Block {
        const last = this.blocks[this.blocks.length-1];
        if (!last) throw new Error("Empty blockchain");
        return last;
    }

    getDifficulty(): number {
        return Math.ceil(this.blocks.length/Blockchain.DIFFICULTY_FACTOR);
    }

    addTransaction(transaction: Transaction) : Validation {
        const validation = transaction.isValid();
        if(!validation.success)
            return new Validation(false, "Invalid tx: "+validation.message);
        
        if(this.blocks.some(b=>b.transactions.some(tx=>tx.hash === transaction.hash)))
            return new Validation(false, "Duplicated tx in blockchain.");

        if(this.mempool.some(tx=>tx.hash === transaction.hash))
            return new Validation(false, "Duplicated tx in mempool.")

        this.mempool.push(transaction);
        return new Validation(true, transaction.hash);
    }

    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();
        
        const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty())
        if(!validation.success) return new Validation(false, `Invalid block: ${validation.message}`);
        
        const txs = block.transactions.filter(tx=> tx.type !== TransactionType.FEE).map(tx=> tx.hash);
        const newMempool = this.mempool.filter(tx=> !txs.includes(tx.hash))
        if(newMempool.length + txs.length !== this.mempool.length)
            return new Validation(false, "Invalid mempool size.");

        this.mempool = newMempool;

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation(true, block.hash);
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
        for(let i=this.blocks.length-1;i>0;i--){
            const currentBlock = this.blocks[i];
            const previsousBlock = this.blocks[i-1];
            if(!currentBlock || !previsousBlock) throw new Error("Block not found during blockchain validation!");
            const validation = currentBlock.isValid(previsousBlock.hash, previsousBlock.index, this.getDifficulty())
            if(!validation.success) return new Validation(false, "Invalid block: "+currentBlock.index+" "+ validation.message);
        }
        return new Validation();
    }

    getFeePerTx(): number {
        return 1;
    }

    getNextBlock(): BlockInfo | null {
        if(!this.mempool || !this.mempool.length)
            return null;

        const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo
    }
}