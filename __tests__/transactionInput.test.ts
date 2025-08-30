import TransactionInput from "../src/lib/transactionInput";
import Wallet from "../src/lib/wallet";

describe("Teste", () => {

    let alice: Wallet;
    let bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    it('Should be valid', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput)
        txInput.sign(alice.privateKey);

        const valid = txInput.isValid();

        expect(valid.success).toBeTruthy()
    })

    it('Should NOT be valid (empty sig)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput)

        const valid = txInput.isValid();

        expect(valid.success).toBeFalsy()
    })

    it('Should NOT be valid (negative amount)', () => {
        const txInput = new TransactionInput({
            amount: -10,
            fromAddress: alice.publicKey
        } as TransactionInput)

        const valid = txInput.isValid();

        expect(valid.success).toBeFalsy()
    })

    it('Should NOT be valid (invalid sig)', () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput)
        txInput.sign(bob.privateKey)
        const valid = txInput.isValid();

        expect(valid.success).toBeFalsy()
    })

    it('Should NOT be valid (defaults)', () => {
        const txInput = new TransactionInput();
        txInput.sign(alice.privateKey)
        const valid = txInput.isValid();

        expect(valid.success).toBeFalsy()
    })
    
})