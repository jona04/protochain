import Block from "../src/lib/block"

describe("Teste", () => {

    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "my hash", "genesis block")
    })

    it('Block is invalid', () => {
        let myBlock = new Block(-1,genesis.hash, "data block 2")
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block is valid', () => {
        let myBlock = new Block(1,genesis.hash, "data block 3")
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeTruthy()
    })

    it('Block hash is not valid', () => {
        let myBlock = new Block(1, genesis.hash, "Test")
        myBlock.hash = "";
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block data is not valid', () => {
        let myBlock = new Block(1, genesis.hash, "")
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block previousHash is not valid', () => {
        let myBlock = new Block(1, "wrong previous", "Data test")
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block timestamp is not valid', () => {
        let myBlock = new Block(1, genesis.hash, "Data test")
        myBlock.timestamp = -1;
        myBlock.hash = myBlock.getHash();
        const validation = myBlock.isValid(genesis.hash, genesis.index)
        console.log("validation", validation.message);
        expect(validation.success).toBeFalsy()
    })
  
})