import CryptoJS from 'crypto-js';
import TransactionType from "./transaction_type.js";
import Validation from "./validation.js";
import TransactionInput from './transactionInput.js';

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    txInput: TransactionInput;
    to: string;

    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.hash = tx?.hash || this.getHash();
        this.txInput = new TransactionInput(tx?.txInput) || new TransactionInput();
    }

    getHash(): string {
        return CryptoJS.SHA256(this.type + this.timestamp + this.to + this.txInput.getHash()).toString();
    }

    isValid(): Validation {
        if(this.hash != this.getHash()) return new Validation(false, "Invalid Hash");
        if(!this.to) return new Validation(false, "Invalid to");

        return new Validation();
    }
}