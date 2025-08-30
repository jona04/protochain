import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import Validation from '../validation.js';


const ECPair = ECPairFactory(ecc);

/**
 * Mocked TransactionInput class
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
        this.fromAddress = txInput?.fromAddress || "wallet1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
    }

    /**
     * Generate signature
     * @param privateKey The 'from' private key
     */
    sign(privateKey: string): void {
        this.signature = "abc"
    }

    /**
     * Generate hash
     * @returns Hash
     */
    getHash(): string {
        return "abc";
    }

    isValid(): Validation {
        if(!this.signature) return new Validation(false, "Signature is required.");
        if(this.amount < 1) return new Validation(false, "Amount must be greater than 0.");

        return new Validation();
    }
}