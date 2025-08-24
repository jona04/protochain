import CryptoJS from 'crypto-js';
import Validation from './validation.js';
import type BlockInfo from './blockInfo.js';
import Transaction from './transaction.js';
import TransactionType from './transaction_type.js';

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions: Transaction[];
    nonce: number;
    miner: string;

    /**
     * Creates new block
     * @param block Block data
     */
    constructor(block?: Block){
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || "";
        this.transactions = block?.transactions ? block.transactions.map(tx=> new Transaction(tx)) : [] as Transaction[];
        this.nonce = block?.nonce || 0;
        this.miner = block?.miner || "";
        this.hash = block?.hash || this.getHash();
    }

    getHash(): string {
        const txs = this.transactions && this.transactions.length 
        ? this.transactions.map(tx => tx.hash).reduce((a,b) => a + b)
        : "";
        return CryptoJS.SHA256(this.index + txs + this.timestamp + this.previousHash + this.nonce + this.miner).toString();
    }

    /**
     * Generates a new valid hash for this block with the specified difficulty
     * @param difficulty Current blockchain difficulty
     * @param miner Wallet address
     */
    mine(difficulty: number, miner: string){
        this.miner = miner;
        const prefix = new Array(difficulty+1).join("0");

        do {
            this.nonce++;
            this.hash = this.getHash();
        } while (!this.hash.startsWith(prefix))
    }

    /**
     * 
     * @param previousHash 
     * @param previsouIndex The previous block index  
     * @param difficulty The blockchain current difficult
     * @returns 
     */
    isValid(previousHash: string, previsouIndex: number, difficulty: number): Validation {
        if(this.transactions && this.transactions.length){
            if(this.transactions.filter(tx=> tx.type === TransactionType.FEE).length > 1)
                return new Validation(false, "Too many fees.");
            
            const validations = this.transactions.map(tx=> tx.isValid());
            const errors = validations.filter(v=> !v.success).map(v=> v.message);
            if(errors.length>0)
                return new Validation(false, "Invalid block due to invalid tx: "+errors.reduce((a,b)=> a+b));
        }

        if (this.index !== previsouIndex+1) return new Validation(false, "Invalid index");
        if (this.previousHash !== previousHash) return new Validation(false, "Invalid previousHash");
        if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
        
        if(!this.nonce || !this.miner ) return new Validation(false, "No mined.");
        
        const prefix = new Array(difficulty + 1).join("0");
        if (this.hash !== this.getHash() || !this.hash.startsWith(prefix)) 
            return new Validation(false, "Invalid hash");

        return new Validation();
    }

    static fromBlockInfo(blockinfo: BlockInfo): Block {
        const block = new Block();
        block.index = blockinfo.index;
        block.previousHash = blockinfo.previousHash;
        block.transactions = blockinfo.transactions;
        
        return block;
    }
}