import Block from "../src/lib/block"

describe("Teste", () => {

    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({index: 0, previousHash: "my hash", data:"Block 1"} as Block)
    })

    it('Block is valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, data:"Block 2"} as Block
        )
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeTruthy()
    })

    it('Block is valid (fallbacks)', () => {
        let myBlock = new Block()
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block hash is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, data:"Block 2"} as Block
        )
        myBlock.hash = "";
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block data is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, data:""} as Block
        )
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block previousHash is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: "Wrong", data:"Block 2"} as Block
        )
        expect(myBlock.isValid(genesis.hash, genesis.index).success).toBeFalsy()
    })

    it('Block timestamp is not valid', () => {
        let myBlock = new Block(
            {index: 1, previousHash: genesis.hash, data:"Block 2"} as Block
        )
        myBlock.timestamp = -1;
        myBlock.hash = myBlock.getHash();
        const validation = myBlock.isValid(genesis.hash, genesis.index)
        expect(validation.success).toBeFalsy()
    })
  
})