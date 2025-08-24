import CryptoJS from 'crypto-js';
import TransactionType from "./transaction_type.js";
import Validation from "./validation.js";

export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    data: string;

    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return CryptoJS.SHA256(this.type + this.timestamp + this.data).toString();
    }

    isValid(): Validation {
        if(this.hash != this.getHash()) return new Validation(false, "Invalid Hash");
        if(!this.data) return new Validation(false, "Invalid Data");

        return new Validation();
    }
}