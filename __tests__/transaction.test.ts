import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/transactionInput");

describe("Teste", () => {

    const exampleDifficulty: number = 0;
    const exampleMiner: string = "jonatas";

    it('Should be valid (REGULAR default)', () => {
        const tx = new Transaction({
            to: "walletTo",
            txInput: new TransactionInput()
        } as Transaction);
        
        const validation = tx.isValid();
        expect(validation.success).toBeTruthy()
    })

    it('Should be valid (REGULAR with params and false hash)', () => {
        const tx = new Transaction({
            txInput: new TransactionInput(),
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            hash: "abc"
        } as Transaction);
        
        const validation = tx.isValid();
        expect(validation.success).toBeFalsy()
    })
    
    it('Should be valid (FEE)', () => {
        const tx = new Transaction({
            to: "wanlletTo",
            type: TransactionType.FEE
        } as Transaction);
        
        tx.txInput = undefined;
        tx.hash = tx.getHash();

        const validation = tx.isValid();
        expect(validation.success).toBeTruthy()
    })

    it('Should be NOT valid (empty data)', () => {
        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);

        const validation = tx.isValid();
        expect(validation.success).toBeFalsy()
    })

    it('Should be NOT valid (invalid txINput)', () => {
        const tx = new Transaction({
            to: "walletTo",
            txInput: new TransactionInput({
                amount: -10,
                fromAddress: "from",
                signature: "abc"
            } as TransactionInput),
        } as Transaction);

        const validation = tx.isValid();
        expect(validation.success).toBeFalsy()
    })
})