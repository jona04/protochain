import Block from "../src/lib/block"
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";
import TransactionInput from "../src/lib/transactionInput";

jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe("Teste", () => {

    const exampleDifficulty: number = 0;
    const exampleMiner: string = "jonatas";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(
            {index: 0, previousHash: "my hash", transactions: [new Transaction(
                {
                    txInput: new TransactionInput()
                } as Transaction)]} as Block)
    })

    it('Block is valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, transactions:[new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]
        } as Block);
        myBlock.mine(exampleDifficulty, exampleMiner);
        const validation = myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(validation.success).toBeTruthy()
    })

    it('Should not be valid (2 FEE)', () => {
        let myBlock = new Block(
            {
                index: 1, 
                previousHash: genesis.hash, 
                transactions:[
                    new Transaction({
                        type: TransactionType.FEE,
                        txInput: new TransactionInput()
                    } as Transaction),
                    new Transaction({
                        type: TransactionType.FEE,
                        txInput: new TransactionInput()
                    } as Transaction),
                ]
        } as Block);
        myBlock.mine(exampleDifficulty, exampleMiner);
        const validation = myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(validation.success).toBeFalsy();
    })

    it('Should not be valid (no data)', () => {
        const tx = new Transaction();

        let myBlock = new Block(
            {
                index: 1, 
                previousHash: genesis.hash, 
                transactions:[new Transaction()]
        } as Block);
        myBlock.mine(exampleDifficulty, exampleMiner);
        
        myBlock.transactions[0].to = "";

        const validation = myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(validation.success).toBeFalsy();
    })

    it('Block is valid (fallbacks)', () => {
        let myBlock = new Block()
        expect(myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty).success).toBeFalsy()
    })

    it('Block hash is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]} as Block
        )
        myBlock.hash = "";
        expect(myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty).success).toBeFalsy()
    })

    it('Block hash is not valid (miner)', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]} as Block
        )
        myBlock.mine(exampleDifficulty, exampleMiner);
        
        myBlock.hash = "";
        expect(myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty).success).toBeFalsy()
    })

    it('Block txINput is not valid', () => {
        const txInput = new TransactionInput();
        txInput.amount = -1;

        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, transactions: [new Transaction({
                txInput
            } as Transaction)]} as Block
        )
        expect(myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty).success).toBeFalsy()
    })

    it('Block previousHash is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: "Wrong", transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]} as Block
        )
        expect(myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty).success).toBeFalsy()
    })

    it('Block timestamp is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)]} as Block
        )
        myBlock.timestamp = -1;
        myBlock.hash = myBlock.getHash();
        const validation = myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty)
        expect(validation.success).toBeFalsy()
    })

    it('Should create from blockinfo', () => {
        let myBlockFromBlockInfo = Block.fromBlockInfo({
            transactions: [new Transaction({
                txInput: new TransactionInput()
            } as Transaction)],
            difficulty: 0,
            feePerTx: 1,
            index: 1,
            maxDifficulty:10,
            previousHash: genesis.hash
        });
        let myBlock = new Block(myBlockFromBlockInfo);
        myBlock.mine(0,"123");
        const validation = myBlock.isValid(genesis.hash, genesis.index, exampleDifficulty)

        expect(validation.success).toBeTruthy()
    })
})