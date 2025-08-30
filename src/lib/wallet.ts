import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);

/**
 * Wallet class
 */
export default class Wallet {
    privateKey: string;
    publicKey: string;

    /**
     * 
     * @param wifOrPrivateKey wif = wallet import format, como se fosse chave privada
     */
    constructor(wifOrPrivateKey?: string){ 
        let keys;
        if (wifOrPrivateKey) {
            if(wifOrPrivateKey.length===64)
                keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey, "hex"));
            else
                keys = ECPair.fromWIF(wifOrPrivateKey);
        }else{
            keys = ECPair.makeRandom();
        }
        this.privateKey = Buffer.from(keys.privateKey!).toString("hex") || "";
        this.publicKey = Buffer.from(keys.publicKey).toString("hex");
    }
}