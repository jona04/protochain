import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');

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
                            data: "Block 2"
                        } as Transaction)]} as Block
        ));
        blockchain.addBlock(new Block(
            {index: 2, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                            data: "Block 3"
                        } as Transaction)]} as Block
        ));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT be valid (two blocks)', () =>{
        const blockchain = new Blockchain();
        const last = blockchain.getLastBlock();
        
        const b2 = new Block(
            {index: last.index + 1, previousHash: last.hash, transactions: [new Transaction({
                            data: "Block 2"
                        } as Transaction)]} as Block
        );
        blockchain.addBlock(b2);
        
        (blockchain as any).blocks[1] = undefined;

        expect(() => blockchain.isValid()).toThrow('Block not found during blockchain validation!');
    })

    test('Should NOT be valid', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(
            {index: 1, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                            data: "Block 2"
                        } as Transaction)]} as Block
        ));
        const block = blockchain.getLastBlock();
        block.index = -1;
        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should add block', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(
            {index: 1, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                            data: "Block 2"
                        } as Transaction)]} as Block
        ));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT add block', () =>{
        const blockchain = new Blockchain();
        const block = new Block(
            {index: -1, previousHash: blockchain.getLastBlock().hash, transactions: [new Transaction({
                            data: "Block 2"
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
        const info = blockchain.getNextBlock();
        expect(info.index).toEqual(1);
    })
    
})
