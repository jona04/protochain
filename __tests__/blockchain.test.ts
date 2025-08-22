import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';

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
        blockchain.addBlock(new Block(1, blockchain.getLastBlock().hash, "Block 2"));
        blockchain.addBlock(new Block(2, blockchain.getLastBlock().hash, "Block 3"));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT be valid (two blocks)', () =>{
        const blockchain = new Blockchain();
        const last = blockchain.getLastBlock();
        
        const b2 = new Block(last.index + 1, last.hash, 'B2');
        blockchain.addBlock(b2);
        
        (blockchain as any).blocks[1] = undefined;

        expect(() => blockchain.isValid()).toThrow('Block not found during blockchain validation!');
    })

    test('Should NOT be valid', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(1, blockchain.getLastBlock().hash, "Block 2"));
        const block = blockchain.getLastBlock();
        block.data = "a transfere 2 para B";
        expect(blockchain.isValid().success).toEqual(false);
    })

    test('Should add block', () =>{
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"));
        expect(blockchain.isValid().success).toEqual(true);
    })

    test('Should NOT add block', () =>{
        const blockchain = new Blockchain();
        const block = new Block(-1, blockchain.blocks[0].hash, "Block 2");
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
})
