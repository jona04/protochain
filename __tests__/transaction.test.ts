import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";

describe("Teste", () => {

    const exampleDifficulty: number = 0;
    const exampleMiner: string = "jonatas";

    it('Should be valid (REGULAR default)', () => {
        const tx = new Transaction({
            data: "tx"
        } as Transaction);
        
        const validation = tx.isValid();
        expect(validation.success).toBeTruthy()
    })

    it('Should be valid (REGULAR with params and false hash)', () => {
        const tx = new Transaction({
            data: "tx",
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            hash: "abc"
        } as Transaction);
        
        const validation = tx.isValid();
        expect(validation.success).toBeFalsy()
    })
    
    it('Should be valid (FEE)', () => {
        const tx = new Transaction({
            data: "tx",
            type: TransactionType.FEE
        } as Transaction);
        
        const validation = tx.isValid();
        expect(validation.success).toBeTruthy()
    })

    it('Should be NOT valid (empty data)', () => {
        const tx = new Transaction({
            data: "",
        } as Transaction);

        const validation = tx.isValid();
        expect(validation.success).toBeFalsy()
    })
})