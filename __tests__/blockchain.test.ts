import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe("Blockchain tests", () => {

    test('Should has genesis blocks', () =>{
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toEqual(1);
    })

    test('Should be valid', () =>{
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should be valid (two blocks)', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(
            {index: 1, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                            txInput: new TransactionInput()
                        } as Transaction)]} as Block
        ));
        blockchain.addBlock(new Block(
            {index: 2, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                txInput: new TransactionInput()
                        } as Transaction)]} as Block
        ));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT be valid (two blocks)', () =>{
        const blockchain = new Blockchain();
        const last = blockchain.getLastBlock();
        
        const b2 = new Block(
            {index: last.index + 1, previousHash: last.hash, transactions: [new Transaction({
                txInput: new TransactionInput()
                        } as Transaction)]} as Block
        );
        blockchain.addBlock(b2);
        
        (blockchain as any).blocks[1] = undefined;

        expect(() => blockchain.isValid()).toThrow('Block not found during blockchain validation!');
    })

    test('Should NOT be valid', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput()
        } as Transaction);
        blockchain.mempool.push(tx);

        blockchain.addBlock(new Block(
            {index: 1, previousHash: blockchain.getLastBlock().hash, transactions: [tx]} as Block
        ));
        const block = blockchain.getLastBlock();
        block.index = -1;
        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should add transaction', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyz"
        } as Transaction);
        
        const validation = blockchain.addTransaction(tx);
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT add transaction (tx)', () =>{
        const blockchain = new Blockchain();
        
        const txInput = new TransactionInput();
        txInput.amount = -10;

        const tx = new Transaction({
            txInput,
            hash: "xyz"
        } as Transaction);
        
        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toEqual(false);
    })

    test('Should NOT add transaction (duplicated blockchain)', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyz"
        } as Transaction);
        
        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toEqual(false);
    })

    test('Should NOT add transaction (duplicated mempool)', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyz"
        } as Transaction);
        
        blockchain.mempool.push(tx);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toEqual(false);
    })

    test('Should get transaction (mempool)', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyz"
        } as Transaction);
        
        blockchain.mempool.push(tx);

        const result = blockchain.getTransaction("xyz");

        expect(result.mempoolIndex).toEqual(0);
    })

    test('Should get transaction (blockchain)', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyz"
        } as Transaction);
        
        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toEqual(1);
    })

    test('Should NOT get transaction', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
            hash: "xyzy"
        } as Transaction);

        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toEqual(-1);
        expect(result.mempoolIndex).toEqual(-1);
    })


    test('Should add block', () =>{
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput: new TransactionInput(),
        } as Transaction);
        blockchain.mempool.push(tx);

        blockchain.addBlock(new Block(
            {index: 1, previousHash: blockchain.getLastBlock().hash, transactions: [tx]} as Block
        ));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT add block', () =>{
        const blockchain = new Blockchain();
        const block = new Block(
            {index: -1, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                txInput: new TransactionInput(),
                        } as Transaction)]} as Block
        );
        const result = blockchain.addBlock(block);
        expect(result.success).toEqual(false);
    })
    
    test('Should get block', () =>{
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        const result = blockchain.isValid();
        expect(result.success).toEqual(true);
    })

    test('getLastBlock with error', () => {
        const bc = new Blockchain();
        (bc as any).blocks = [] as any;
        expect(() => bc.getLastBlock()).toThrow('Empty blockchain');
    });

    test('Should get getNextBlockInfo', () =>{
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction());

        const info = blockchain.getNextBlock();
        expect(info ? info.index : 0).toEqual(1);
    })
    
    test('Should NOT get getNextBlockInfo', () =>{
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    })
})
