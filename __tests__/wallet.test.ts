import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import Wallet from "../src/lib/wallet";

jest.mock('../src/lib/transaction');

const ECPair = ECPairFactory(ecc);

describe("Teste", () => {

    let alice: Wallet;
    
    beforeAll(() => {
        alice = new Wallet()
    });
    
    it('Should generate wallet', () => {
        const wallet = new Wallet()
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    })

    it('Should recover wallet (PK)', () => {
        const wallet = new Wallet(alice.privateKey);

        expect(wallet.publicKey).toEqual(alice.publicKey);
    })

    it('Should recover wallet (WIF)', () => {
        const wallet = new Wallet('L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6');

        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    })

    it("recupera por private key hex (64 chars)", () => {
        const w = new Wallet(alice.privateKey);       // cobre linha 21–22
        expect(w.publicKey).toEqual(alice.publicKey);
      });
      
    it("recupera por WIF", () => {
        // Gere um WIF válido e compare publicKey para garantir que caiu no else (linha 24)
        const pair = ECPair.makeRandom();
        const wif = pair.toWIF();
        const expectedPub = Buffer.from(pair.publicKey).toString("hex");
    
        const w = new Wallet(wif);                    // cobre linha 24
        expect(w.publicKey).toBe(expectedPub);
      });
    
      it("lança erro com string inválida (nem 64, nem WIF)", () => {
        expect(() => new Wallet("abc")).toThrow();    // força passar pela linha 24 e falhar
      });
})