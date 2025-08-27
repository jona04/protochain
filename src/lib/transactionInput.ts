import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import Validation from './validation.js';


const ECPair = ECPairFactory(ecc);

/**
 * TransactionInput class
 */
export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Create a new TransactionInput
     * @param txInput Tx input data
     */
    constructor(txInput?: TransactionInput) {
        this.fromAddress = txInput?.fromAddress || "";
        this.amount = txInput?.amount || 0;
        this.signature = txInput?.signature || "";
    }

    /**
     * Generate signature
     * @param privateKey The 'from' private key
     */
    sign(privateKey: string): void {
        this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
        .sign(Buffer.from(this.getHash(), "hex"))
        .toString("hex");
    }

    /**
     * Generate hash
     * @returns Hash
     */
    getHash(): string {
        return CryptoJS.SHA256(this.fromAddress + this.amount).toString();
    }

    isValid(): Validation {
        if(!this.signature) return new Validation(false, "Signature is required.");
        if(this.amount < 1) return new Validation(false, "Amount must be greater than 0.");

        const hash = Buffer.from(this.getHash(), "hex");
        const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAddress, "hex"))
            .verify(hash, Buffer.from(this.signature, "hex"));

        return isValid ? new Validation : new Validation(false, "Invalid transaction signature.");
    }
}