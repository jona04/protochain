import CryptoJS from 'crypto-js';
import TransactionType from "./transaction_type.js";
import Validation from "./validation.js";
import TransactionInput from './transactionInput.js';

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    txInput: TransactionInput | undefined;
    to: string;


    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.txInput = tx?.txInput ? new TransactionInput(tx?.txInput) : new TransactionInput();
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        const from = this.txInput ? this.txInput.getHash() : "";
        return CryptoJS.SHA256(this.type + this.timestamp + this.to + from).toString();
    }

    isValid(): Validation {
        if(this.hash != this.getHash()) return new Validation(false, "Invalid Hash");
        if(!this.to) return new Validation(false, "Invalid to");
        
        if(this.txInput){
            const validation = this.txInput.isValid();
            if(!validation.success)
                return new Validation(false, `Invalid tx: ${validation.message}`);
        }

        return new Validation();
    }
}